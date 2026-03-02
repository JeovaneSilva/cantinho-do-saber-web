import { Link, useNavigate } from 'react-router-dom';
import { BookX, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md animate-scale-in">
        
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
          <BookX className="w-12 h-12 text-primary relative z-10" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-display font-extrabold text-primary opacity-20 tracking-widest">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Ops! Página não encontrada
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Parece que o conteúdo que você estava procurando não está no nosso <strong>Cantinho do Saber</strong>. Ele pode ter sido movido ou excluído.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          
          <Link 
            to="/" 
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Página Inicial
          </Link>
        </div>
        
      </div>
    </div>
  );
}