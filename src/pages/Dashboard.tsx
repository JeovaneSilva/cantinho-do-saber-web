import { Users, Calendar, CreditCard, FolderOpen } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingClasses } from '@/components/dashboard/UpcomingClasses';
import { RecentPayments } from '@/components/dashboard/RecentPayments';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Olá, Professora Maria! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o resumo do seu dia. Bom trabalho!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Alunos"
            value={24}
            subtitle="3 novos este mês"
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Aulas Hoje"
            value={8}
            subtitle="Próxima às 14:00"
            icon={Calendar}
            variant="secondary"
          />
          <StatCard
            title="Pagamentos Pendentes"
            value="R$ 1.200"
            subtitle="4 alunos"
            icon={CreditCard}
            variant="accent"
          />
          <StatCard
            title="Materiais"
            value={47}
            subtitle="5 novos esta semana"
            icon={FolderOpen}
            variant="success"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Classes */}
          <div className="lg:col-span-2">
            <UpcomingClasses />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPayments />
          
          {/* Weekly Summary */}
          <div className="card-educational animate-slide-up">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">
              Resumo da Semana
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                <div>
                  <p className="font-semibold text-foreground">Aulas Realizadas</p>
                  <p className="text-sm text-muted-foreground">Segunda a Sexta</p>
                </div>
                <p className="text-2xl font-bold text-success">32</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div>
                  <p className="font-semibold text-foreground">Pagamentos Recebidos</p>
                  <p className="text-sm text-muted-foreground">Esta semana</p>
                </div>
                <p className="text-2xl font-bold text-primary">R$ 3.500</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <div>
                  <p className="font-semibold text-foreground">Novos Materiais</p>
                  <p className="text-sm text-muted-foreground">Compartilhados</p>
                </div>
                <p className="text-2xl font-bold text-secondary">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
