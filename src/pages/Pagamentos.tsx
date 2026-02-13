import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown, Loader2, Edit2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePagamentos } from '@/hooks/usePagamentos';
import { Pagamento } from '@/services/pagamentos';
import { EditPaymentModal } from '@/components/payment/EditPaymentModal';
import { CreatePaymentModal } from '@/components/payment/CreatePaymentModal';

const statusConfig = {
  PAGO: { label: 'Pago', icon: CheckCircle, className: 'badge-success' },
  PENDENTE: { label: 'Pendente', icon: Clock, className: 'badge-warning' },
  ATRASADO: { label: 'Atrasado', icon: AlertCircle, className: 'badge-destructive' },
};

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Pagamentos() {
  // Pegamos o selectedMonth e o setSelectedMonth do hook
  const { pagamentos, isLoading, createPagamento, updatePagamento, selectedMonth, setSelectedMonth } = usePagamentos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAGO' | 'PENDENTE' | 'ATRASADO'>('ALL');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Pagamento | null>(null);

  const filteredPayments = pagamentos.filter((payment) => {
    const matchesSearch = payment.aluno.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Cálculos (Baseados na lista filtrada pelo backend, ou seja, só do mês atual)
  const totalReceived = pagamentos.filter(p => p.status === 'PAGO').reduce((sum, p) => sum + Number(p.valor), 0);
  const totalPending = pagamentos.filter(p => p.status === 'PENDENTE').reduce((sum, p) => sum + Number(p.valor), 0);
  const totalOverdue = pagamentos.filter(p => p.status === 'ATRASADO').reduce((sum, p) => sum + Number(p.valor), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Pagamentos</h1>
            <p className="text-muted-foreground mt-1">
              Controle financeiro de <span className="text-primary font-semibold">{selectedMonth}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* SELETOR DE MÊS */}
            <div className="relative">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <select 
                 value={selectedMonth}
                 onChange={(e) => setSelectedMonth(e.target.value)}
                 className="pl-9 pr-8 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium appearance-none cursor-pointer hover:bg-muted focus:ring-2 focus:ring-primary/20 outline-none"
               >
                 <option value="">Todos os meses</option>
                 {MONTHS.map(m => (
                   <option key={m} value={m}>{m}</option>
                 ))}
               </select>
            </div>

            <button 
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90"
            >
              <Plus className="w-5 h-5" /> Novo Pagamento
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
           <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-scale-in">
              <div className="card-educational flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-success" /></div>
                <div><p className="text-sm text-muted-foreground">Recebido</p><p className="text-2xl font-bold text-success">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceived)}</p></div>
              </div>
              <div className="card-educational flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/15 flex items-center justify-center"><Clock className="w-6 h-6 text-warning" /></div>
                <div><p className="text-sm text-muted-foreground">Pendente</p><p className="text-2xl font-bold text-warning">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}</p></div>
              </div>
              <div className="card-educational flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center"><TrendingDown className="w-6 h-6 text-destructive" /></div>
                <div><p className="text-sm text-muted-foreground">Atrasado</p><p className="text-2xl font-bold text-destructive">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOverdue)}</p></div>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nome do aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['ALL', 'PAGO', 'PENDENTE', 'ATRASADO'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg font-medium transition-all",
                      filterStatus === status
                        ? status === 'PAGO' ? "bg-success text-success-foreground"
                        : status === 'PENDENTE' ? "bg-warning text-warning-foreground"
                        : status === 'ATRASADO' ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {status === 'ALL' ? 'Todos' : statusConfig[status].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabela */}
            <div className="card-educational overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Aluno</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Mês</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Vencimento</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Valor</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                      <th className="text-center py-4 px-6 font-semibold text-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => {
                      const config = statusConfig[payment.status];
                      const StatusIcon = config.icon;

                      return (
                        <tr key={payment.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                                {payment.aluno.nome.charAt(0)}
                              </div>
                              <span className="font-medium text-foreground">{payment.aluno.nome}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">{payment.mesReferencia}</td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {new Date(payment.dataVencimento).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-foreground">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(payment.valor))}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={config.className}>
                              <StatusIcon className="w-3 h-3 mr-1 inline" />
                              {config.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button 
                              onClick={() => setPaymentToEdit(payment)}
                              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="Editar pagamento"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredPayments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-muted-foreground">
                           Nenhum pagamento encontrado para este mês.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <CreatePaymentModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createPagamento}
      />

      <EditPaymentModal 
        isOpen={!!paymentToEdit}
        onClose={() => setPaymentToEdit(null)}
        payment={paymentToEdit}
        onSubmit={updatePagamento}
      />
    </MainLayout>
  );
}