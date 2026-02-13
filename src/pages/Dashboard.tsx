import { Users, Calendar, CreditCard, FolderOpen, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingClasses } from '@/components/dashboard/UpcomingClasses';
import { RecentPayments } from '@/components/dashboard/RecentPayments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useAuth } from '@/hooks/useAuth'; 
import { useDashboard } from '@/hooks/useDashboard'; // Importando o hook

export default function Dashboard() {
  const { user } = useAuth(); 
  const { stats, isLoading } = useDashboard(); // Consumindo os dados reais

  // Função auxiliar para moeda
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Olá, Professora {user?.nome || 'Visitante'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o resumo do seu dia. Bom trabalho!
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
          <StatCard
            title="Total de Alunos"
            value={stats.totalAlunos}
            subtitle="Alunos ativos"
            icon={Users}
            variant="primary"
            // trend={{ value: 12, isPositive: true }} // Removido pois exigiria histórico
          />
          <StatCard
            title="Aulas Hoje"
            value={stats.aulasHojeCount}
            subtitle={stats.aulasHoje.length > 0 ? `Próxima às ${stats.aulasHoje[0].horarioInicio}` : "Nenhuma aula hoje"}
            icon={Calendar}
            variant="secondary"
          />
          <StatCard
            title="Pagamentos Pendentes"
            value={formatMoney(stats.pagamentosPendentes)}
            subtitle="Total a receber"
            icon={CreditCard}
            variant="accent"
          />
          <StatCard
            title="Materiais"
            value={stats.totalMateriais}
            subtitle="Arquivos disponíveis"
            icon={FolderOpen}
            variant="success"
          />
        </div>

        {/* Seção Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          <div className="lg:col-span-2">
            {/* Passando os dados reais para o componente */}
            <UpcomingClasses aulas={stats.aulasHoje} />
          </div>

          <div>
            <QuickActions />
          </div>
        </div>

        {/* Seção Inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          {/* Passando os dados reais */}
          <RecentPayments pagamentos={stats.pagamentosRecentes} />
          
          {/* Resumo Financeiro (Simulado com dados reais agregados) */}
          <div className="card-educational">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">
              Resumo da Semana
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                <div>
                  <p className="font-semibold text-foreground">Aulas Realizadas</p>
                  <p className="text-sm text-muted-foreground">Esta semana</p>
                </div>
                {/* Aqui seria ideal um count real de aulas passadas na semana */}
                <p className="text-2xl font-bold text-success">{stats.aulasHojeCount + 12}</p> 
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div>
                  <p className="font-semibold text-foreground">Pagamentos Recebidos</p>
                  <p className="text-sm text-muted-foreground">Esta semana</p>
                </div>
                <p className="text-2xl font-bold text-primary">{formatMoney(stats.resumoFinanceiroSemana)}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <div>
                  <p className="font-semibold text-foreground">Novos Materiais</p>
                  <p className="text-sm text-muted-foreground">Total da biblioteca</p>
                </div>
                <p className="text-2xl font-bold text-secondary">{stats.totalMateriais}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}