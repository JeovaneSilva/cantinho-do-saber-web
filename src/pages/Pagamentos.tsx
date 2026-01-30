import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Download, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Payment {
  id: number;
  studentName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  month: string;
}

const payments: Payment[] = [
  { id: 1, studentName: 'João Silva', amount: 250, status: 'paid', dueDate: '2025-01-10', paidDate: '2025-01-08', month: 'Janeiro' },
  { id: 2, studentName: 'Ana Costa', amount: 300, status: 'pending', dueDate: '2025-01-15', month: 'Janeiro' },
  { id: 3, studentName: 'Pedro Santos', amount: 250, status: 'overdue', dueDate: '2025-01-05', month: 'Janeiro' },
  { id: 4, studentName: 'Maria Oliveira', amount: 280, status: 'paid', dueDate: '2025-01-08', paidDate: '2025-01-07', month: 'Janeiro' },
  { id: 5, studentName: 'Lucas Ferreira', amount: 250, status: 'pending', dueDate: '2025-01-20', month: 'Janeiro' },
  { id: 6, studentName: 'Julia Mendes', amount: 320, status: 'paid', dueDate: '2025-01-12', paidDate: '2025-01-12', month: 'Janeiro' },
];

const statusConfig = {
  paid: { label: 'Pago', icon: CheckCircle, className: 'badge-success' },
  pending: { label: 'Pendente', icon: Clock, className: 'badge-warning' },
  overdue: { label: 'Atrasado', icon: AlertCircle, className: 'badge-destructive' },
};

export default function Pagamentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalReceived = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Pagamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Controle as mensalidades dos alunos
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors">
              <Download className="w-5 h-5" />
              Exportar
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Novo Pagamento
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          <div className="card-educational flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recebido</p>
              <p className="text-2xl font-bold text-success">R$ {totalReceived.toFixed(2)}</p>
            </div>
          </div>
          <div className="card-educational flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/15 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendente</p>
              <p className="text-2xl font-bold text-warning">R$ {totalPending.toFixed(2)}</p>
            </div>
          </div>
          <div className="card-educational flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Atrasado</p>
              <p className="text-2xl font-bold text-destructive">R$ {totalOverdue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome do aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'paid', 'pending', 'overdue'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-4 py-2.5 rounded-lg font-medium transition-all",
                  filterStatus === status
                    ? status === 'paid' ? "bg-success text-success-foreground"
                    : status === 'pending' ? "bg-warning text-warning-foreground"
                    : status === 'overdue' ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {status === 'all' ? 'Todos' : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="card-educational overflow-hidden p-0 animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Aluno</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Mês</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Vencimento</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Valor</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const config = statusConfig[payment.status];
                  const StatusIcon = config.icon;

                  return (
                    <tr key={payment.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                            {payment.studentName.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{payment.studentName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{payment.month}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-foreground">R$ {payment.amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={config.className}>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {config.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {payment.status !== 'paid' && (
                          <button className="text-sm text-primary font-medium hover:underline">
                            Registrar pagamento
                          </button>
                        )}
                        {payment.status === 'paid' && payment.paidDate && (
                          <span className="text-sm text-muted-foreground">
                            Pago em {new Date(payment.paidDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
