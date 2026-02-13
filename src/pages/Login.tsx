import { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; 

export default function Login() {
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      
      await signIn(email, password); 
      

    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Email ou senha incorretos.');
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border-border border-2 rounded-2xl shadow-xl p-8 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground mt-2">
            Faça login para gerenciar o Cantinho do Saber
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm font-medium animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="professor@cantinho.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-primary-foreground transition-all shadow-lg",
              isLoading 
                ? "bg-primary/70 cursor-not-allowed" 
                : "gradient-primary hover:opacity-90 active:scale-[0.98]"
            )}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                Entrar no Sistema
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}