import { UserPlus, CalendarPlus, FileUp, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  {
    title: 'Novo Aluno',
    description: 'Cadastrar um novo aluno',
    icon: UserPlus,
    href: '/alunos',
    gradient: 'gradient-primary',
  },
  {
    title: 'Agendar Aula',
    description: 'Adicionar nova aula à agenda',
    icon: CalendarPlus,
    href: '/agenda',
    gradient: 'gradient-secondary',
  },
  {
    title: 'Upload Material',
    description: 'Compartilhar material didático',
    icon: FileUp,
    href: '/materiais',
    gradient: 'gradient-accent text-accent-foreground',
  },
  {
    title: 'Registrar Pagamento',
    description: 'Registrar novo pagamento',
    icon: Receipt,
    href: '/pagamentos',
    gradient: 'bg-success',
  },
];

export function QuickActions() {
  return (
    <div className="card-educational h-[400px] animate-slide-up">
      <h3 className="font-display text-lg font-bold text-foreground mb-6">
        Ações Rápidas
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="group p-4 rounded-xl border border-border hover:border-primary/30 bg-card hover:bg-muted/30 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-lg ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-foreground text-sm">
              {action.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
