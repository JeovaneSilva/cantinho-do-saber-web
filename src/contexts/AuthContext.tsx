import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/services/api';
import { authService } from '@/services/auth';
import { userService } from '@/services/user';


interface User {
  id: number;
  nome: string;
  email: string;
}

interface JwtPayload {
  sub: number;
  exp: number;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserFromToken() {
      const token = localStorage.getItem('@CantinhoDoSaber:token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.exp * 1000 < Date.now()) {
          throw new Error('Token expirado'); 
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const userData = await userService.getUserById(decoded.sub);

        setUser(userData);

      } catch (error) {
        signOut(); 
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromToken();
  }, []);

  async function signIn(email: string, senha: string) {
    const token = await authService.login({ email, senha });

    localStorage.setItem('@CantinhoDoSaber:token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const decoded = jwtDecode<JwtPayload>(token);

    const userData = await userService.getUserById(decoded.sub);

    setUser(userData);
    navigate('/dashboard'); 
  }

  function signOut() {
    localStorage.removeItem('@CantinhoDoSaber:token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}