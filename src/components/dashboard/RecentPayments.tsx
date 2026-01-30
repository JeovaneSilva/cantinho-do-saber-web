import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Payment {
  id: number;
  studentName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

const recentPayments: Payment[] = [
  { id: 1, studentName: 'João Silva', amount: 250, status: 'paid', dueDate: '10/01' },
  { id: 2, studentName: 'Ana Costa', amount: 300, status: 'pending', dueDate: '15/01' },
  { id: 3, studentName: 'Pedro Santos', amount: 250, status: 'overdue', dueDate: '05/01' },
  { id: 4, studentName: 'Maria Oliveira', amount: 280, status: 'paid', dueDate: '08/01' },
];

const statusConfig = {
  paid: {
    label: 'Pago',
    icon: CheckCircle,
    className: 'badge-success',
  },
  pending: {
    label: 'Pendente',
    icon: Clock,
    className: 'badge-warning',
  },
  overdue: {
    label: 'Atrasado',
    icon: AlertCircle,
    className: 'badge-destructive',
  },
};

export function RecentPayments() {
  return (
    <div className="card-educational animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-bold text-foreground">
          Pagamentos Recentes
        </h3>
        <span className="text-sm text-muted-foreground">Janeiro 2025</span>
      </div>
      
      <div className="space-y-4">
        {recentPayments.map((payment) => {
          const config = statusConfig[payment.status];
          const StatusIcon = config.icon;
          
          return (
            <div 
              key={payment.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {payment.studentName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Vencimento: {payment.dueDate}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">
                  R$ {payment.amount.toFixed(2)}
                </p>
                <span className={cn("mt-1", config.className)}>
                  <StatusIcon className="w-3 h-3 mr-1 inline" />
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
        Ver todos os pagamentos →
      </button>
    </div>
  );
}
