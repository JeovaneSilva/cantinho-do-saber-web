import { Pagamento } from '@/services/pagamentos';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface RecentPaymentsProps {
  pagamentos: Pagamento[];
}

const statusConfig = {
  PAGO: { icon: CheckCircle, className: 'text-success' },
  PENDENTE: { icon: Clock, className: 'text-warning' },
  ATRASADO: { icon: AlertCircle, className: 'text-destructive' },
};

export function RecentPayments({ pagamentos }: RecentPaymentsProps) {
  return (
    <div className="card-educational h-[400px] flex flex-col">
      <h3 className="font-display text-lg font-bold text-foreground mb-6">Pagamentos Recentes</h3>
      <div className="space-y-4  overflow-y-auto min-h-0 custom-scrollbar">
        {pagamentos.length === 0 ? (
           <p className="text-sm text-muted-foreground">Nenhum registro recente.</p>
        ) : (
          pagamentos.map((pagamento) => {
            const config = statusConfig[pagamento.status];
            const Icon = config.icon;
            return (
              <div key={pagamento.id} className="flex items-center mr-3 justify-between p-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm text-foreground">{pagamento.aluno.nome}</p>
                  <p className="text-xs text-muted-foreground">{pagamento.mesReferencia}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(pagamento.valor))}
                  </p>
                  <div className={`flex items-center justify-end gap-1 text-xs ${config.className}`}>
                    <Icon className="w-3 h-3" />
                    <span>{pagamento.status}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}