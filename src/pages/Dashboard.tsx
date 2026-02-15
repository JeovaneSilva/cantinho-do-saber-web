import { Users, Calendar, CreditCard, FolderOpen, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { UpcomingClasses } from "@/components/dashboard/UpcomingClasses";
import { RecentPayments } from "@/components/dashboard/RecentPayments";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { TeacherToDos } from "@/components/dashboard/TeacherToDos";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboard();

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

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
            Olá, Professora {user?.nome || "Visitante"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o resumo do seu dia. Bom trabalho!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
          <StatCard title="Total de Alunos" value={stats.totalAlunos} subtitle="Alunos ativos" icon={Users} variant="primary" />
          <StatCard title="Aulas Hoje" value={stats.aulasHojeCount} subtitle={stats.aulasHoje.length > 0 ? `Próxima às ${stats.aulasHoje[0].horarioInicio}` : "Nenhuma aula hoje"} icon={Calendar} variant="secondary" />
          <StatCard title="Pagamentos Pendentes" value={formatMoney(stats.pagamentosPendentes)} subtitle="Total a receber" icon={CreditCard} variant="accent" />
          <StatCard title="Materiais" value={stats.totalMateriais} subtitle="Arquivos disponíveis" icon={FolderOpen} variant="success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          <div className="lg:col-span-2">
            <UpcomingClasses aulas={stats.aulasHoje} />
          </div>
          <div>
            <div className="h-[400px]"> 
               <QuickActions />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          <div className="h-[400px]">
             <RecentPayments pagamentos={stats.pagamentosRecentes} />
          </div>
          <div className="h-[400px]">
             <TeacherToDos />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}