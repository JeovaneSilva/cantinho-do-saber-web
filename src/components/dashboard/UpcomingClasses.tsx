import { Clock, User } from 'lucide-react';

interface ClassItem {
  id: number;
  studentName: string;
  subject: string;
  time: string;
  teacher: string;
}

const upcomingClasses: ClassItem[] = [
  { id: 1, studentName: 'João Silva', subject: 'Matemática', time: '14:00', teacher: 'Prof. Maria' },
  { id: 2, studentName: 'Ana Costa', subject: 'Português', time: '15:30', teacher: 'Prof. Maria' },
  { id: 3, studentName: 'Pedro Santos', subject: 'Ciências', time: '16:30', teacher: 'Prof. Carla' },
  { id: 4, studentName: 'Maria Oliveira', subject: 'História', time: '17:30', teacher: 'Prof. Maria' },
];

export function UpcomingClasses() {
  return (
    <div className="card-educational animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-bold text-foreground">
          Próximas Aulas
        </h3>
        <span className="text-sm text-muted-foreground">Hoje</span>
      </div>
      
      <div className="space-y-4">
        {upcomingClasses.map((classItem) => (
          <div 
            key={classItem.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {classItem.studentName}
              </p>
              <p className="text-sm text-muted-foreground">
                {classItem.subject} • {classItem.teacher}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{classItem.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
        Ver agenda completa →
      </button>
    </div>
  );
}
