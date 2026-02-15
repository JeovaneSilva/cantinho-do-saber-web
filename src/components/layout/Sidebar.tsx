import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  FolderOpen, 
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; 
import logo from '../../../public/logo-cantinho-do-saber.jpeg'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Alunos', href: '/alunos', icon: Users },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Pagamentos', href: '/pagamentos', icon: CreditCard },
  { name: 'Materiais', href: '/materiais', icon: FolderOpen },
];

export function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { user, signOut } = useAuth(); 

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar transform transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
                <img src={logo} alt="" className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center" />
              <div>
                <h1 className="font-display font-bold text-lg text-sidebar-foreground">
                  Cantinho do Saber
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Reforço Escolar
                </p>
              </div>
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "sidebar-link",
                    isActive && "active"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.nome || 'Carregando...'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            
            <button 
              onClick={signOut}
              className="sidebar-link w-full text-sidebar-foreground/60 hover:text-secondary"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}