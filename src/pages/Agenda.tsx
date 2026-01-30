import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassEvent {
  id: number;
  studentName: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  color: string;
}

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const weekDaysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const classEvents: Record<number, ClassEvent[]> = {
  1: [ // Monday
    { id: 1, studentName: 'João Silva', subject: 'Matemática', teacher: 'Prof. Maria', startTime: '14:00', endTime: '15:00', color: 'gradient-primary' },
    { id: 2, studentName: 'Ana Costa', subject: 'Português', teacher: 'Prof. Maria', startTime: '15:30', endTime: '16:30', color: 'gradient-secondary' },
    { id: 3, studentName: 'Lucas Ferreira', subject: 'Física', teacher: 'Prof. Carla', startTime: '17:00', endTime: '18:00', color: 'gradient-accent text-accent-foreground' },
  ],
  2: [ // Tuesday
    { id: 4, studentName: 'Maria Oliveira', subject: 'História', teacher: 'Prof. Maria', startTime: '14:00', endTime: '15:00', color: 'gradient-primary' },
    { id: 5, studentName: 'Pedro Santos', subject: 'Ciências', teacher: 'Prof. Carla', startTime: '16:00', endTime: '17:00', color: 'bg-success' },
  ],
  3: [ // Wednesday
    { id: 6, studentName: 'Julia Mendes', subject: 'Inglês', teacher: 'Prof. Maria', startTime: '14:30', endTime: '15:30', color: 'gradient-secondary' },
    { id: 7, studentName: 'João Silva', subject: 'Matemática', teacher: 'Prof. Maria', startTime: '16:00', endTime: '17:00', color: 'gradient-primary' },
    { id: 8, studentName: 'Ana Costa', subject: 'Redação', teacher: 'Prof. Maria', startTime: '17:30', endTime: '18:30', color: 'gradient-accent text-accent-foreground' },
  ],
  4: [ // Thursday
    { id: 9, studentName: 'Pedro Santos', subject: 'Ciências', teacher: 'Prof. Carla', startTime: '14:00', endTime: '15:00', color: 'bg-success' },
    { id: 10, studentName: 'Maria Oliveira', subject: 'Geografia', teacher: 'Prof. Maria', startTime: '15:30', endTime: '16:30', color: 'gradient-primary' },
  ],
  5: [ // Friday
    { id: 11, studentName: 'Lucas Ferreira', subject: 'Matemática', teacher: 'Prof. Maria', startTime: '14:00', endTime: '15:00', color: 'gradient-primary' },
    { id: 12, studentName: 'Julia Mendes', subject: 'Espanhol', teacher: 'Prof. Carla', startTime: '15:30', endTime: '16:30', color: 'gradient-secondary' },
    { id: 13, studentName: 'João Silva', subject: 'Física', teacher: 'Prof. Carla', startTime: '17:00', endTime: '18:00', color: 'gradient-accent text-accent-foreground' },
  ],
};

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

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

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const selectedDayEvents = classEvents[selectedDay] || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Agenda
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie as aulas da semana
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Nova Aula
          </button>
        </div>

        {/* Week Navigation */}
        <div className="card-educational animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="font-display font-bold text-lg text-foreground">
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = index === selectedDay;
              const hasEvents = classEvents[index] && classEvents[index].length > 0;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl transition-all",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday
                      ? "bg-accent/20 text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="text-xs font-medium opacity-70 hidden sm:block">
                    {weekDaysShort[index]}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                  {hasEvents && !isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Events */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-xl text-foreground">
              {weekDays[selectedDay]}, {weekDates[selectedDay].toLocaleDateString('pt-BR')}
            </h3>
            <span className="text-sm text-muted-foreground">
              {selectedDayEvents.length} aula{selectedDayEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="card-educational flex items-center gap-4 group"
                >
                  <div className={cn("w-2 h-16 rounded-full", event.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-semibold text-foreground truncate">
                        {event.studentName}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.subject} • {event.teacher}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-primary font-bold">
                      <Clock className="w-4 h-4" />
                      {event.startTime}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      até {event.endTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-educational text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Nenhuma aula agendada para este dia
              </p>
              <button className="mt-4 text-primary font-medium hover:underline">
                Agendar nova aula
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
