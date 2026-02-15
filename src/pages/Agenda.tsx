import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgenda } from '@/hooks/useAgenda';
import { Aula, aulasService } from '@/services/agenda';
import { ClassDetailsModal } from '@/components/class/ClassDetailsModal';
import { ClassFormModal } from '@/components/class/ClassFormModal';

const weekDaysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const weekDaysFull = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const getAulaColor = (id: number) => {
  const colors = [
    'gradient-primary',
    'gradient-secondary',
    'gradient-accent text-accent-foreground',
    'bg-success/20 text-success-foreground border-success',
    'bg-warning/20 text-warning-foreground border-warning'
  ];
  return colors[id % colors.length];
};

const formatName = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  if (parts.length <= 1) return parts[0];
  return `${parts[0]} ${parts[1]}`;
};

export default function Agenda() {
  const { currentDate, selectDate, aulas, isLoading, refreshAgenda } = useAgenda();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  const handleCreateClass = async (data: any) => {
    await aulasService.create({ ...data, professorId: 1 });
    refreshAgenda();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    selectDate(newDate);
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground mt-1">Visualize e gerencie as aulas da semana</p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Nova Aula
          </button>
        </div>

        <div className="card-educational animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateWeek('prev')} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="font-display font-bold text-lg text-foreground capitalize">
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => navigateWeek('next')} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const isSelected = date.toDateString() === currentDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={index}
                  onClick={() => selectDate(date)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl transition-all relative overflow-hidden",
                    isSelected ? "bg-primary text-primary-foreground shadow-md transform scale-105" : 
                    isToday ? "bg-accent/20 text-accent-foreground ring-1 ring-accent" : 
                    "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-xs font-medium opacity-80 hidden sm:block">{weekDaysShort[index]}</span>
                  <span className={cn("text-lg font-bold", isSelected ? "text-white" : "")}>{date.getDate()}</span>
                  {isToday && !isSelected && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-xl text-foreground">
              {weekDaysFull[currentDate.getDay()]}, {currentDate.toLocaleDateString('pt-BR')}
            </h3>
            <span className="text-sm text-muted-foreground">{aulas.length} aula{aulas.length !== 1 ? 's' : ''}</span>
          </div>

          {isLoading ? (
             <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : aulas.length > 0 ? (
            <div className="space-y-4">
              {aulas.map((aula) => (
                <div
                  key={aula.id}
                  onClick={() => setSelectedAula(aula)}
                  className="card-educational flex items-center gap-4 group hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className={cn("w-1.5 h-16 rounded-full self-stretch my-auto", getAulaColor(aula.id))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {aula.alunos.length > 1 ? <Users className="w-4 h-4 text-muted-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
                      
                      <h4 className="font-semibold text-foreground truncate text-base">
                        {aula.alunos.length > 0 
                          ? aula.alunos.map(a => formatName(a.nome)).join(', ') 
                          : 'Sem alunos'}
                      </h4>
                    
                    </div>
                    <p className="text-sm text-muted-foreground">{aula.observacoes || 'Aula regular'}</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="flex items-center justify-end gap-1.5 text-primary font-bold">
                      <Clock className="w-4 h-4" />{aula.horarioInicio}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">até {aula.horarioFim}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-educational text-center py-12 border-dashed">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><Clock className="w-8 h-8 text-muted-foreground" /></div>
              <p className="text-muted-foreground">Nenhuma aula agendada para este dia.</p>
              <button onClick={() => setIsCreateOpen(true)} className="mt-4 text-primary font-medium hover:underline">Agendar nova aula</button>
            </div>
          )}
        </div>
      </div>

      <ClassFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreateClass} />
      
    
      <ClassDetailsModal 
        isOpen={!!selectedAula} 
        onClose={() => setSelectedAula(null)} 
        aula={selectedAula} 
        onUpdate={refreshAgenda} 
      />
    </MainLayout>
  );
}