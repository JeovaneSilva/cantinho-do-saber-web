import { Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Aula } from '@/services/agenda';

interface UpcomingClassesProps {
  aulas: Aula[];
}

export function UpcomingClasses({ aulas }: UpcomingClassesProps) {
  
  const isAulaConcluida = (horarioFim: string) => {
    const agora = new Date();
    const [hora, min] = horarioFim.split(':').map(Number);
    const dataFim = new Date();
    dataFim.setHours(hora, min, 0, 0);
    return dataFim < agora;
  };

  return (
    <div className="card-educational h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-none">
        <h3 className="font-display text-lg font-bold text-foreground">Aulas de Hoje</h3>
        <span className="text-xs text-muted-foreground">
           {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-2 custom-scrollbar">
        {aulas.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
             <p className="text-sm">Nenhuma aula agendada.</p>
          </div>
        ) : (
          aulas.map((aula) => {
            const concluida = isAulaConcluida(aula.horarioFim);

            return (
              <div 
                key={aula.id} 
                className={cn(
                  "flex items-center p-3 rounded-lg border transition-all shrink-0", 
                  concluida 
                    ? "bg-muted/30 border-border/50 opacity-60" 
                    : "bg-card border-border shadow-sm hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0",
                  concluida ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                )}>
                  {concluida ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-semibold text-sm truncate",
                    concluida ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {aula.alunos.map(a => a.nome.split(' ')[0]).join(', ')}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {concluida ? 'Concluída' : 'Aula Regular'}
                  </p>
                </div>
                
                <div className="text-right pl-2 shrink-0">
                  <p className={cn("font-bold text-sm", concluida ? "text-muted-foreground" : "text-foreground")}>
                    {aula.horarioInicio}
                  </p>
                  <p className="text-xs text-muted-foreground">até {aula.horarioFim}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border text-center flex-none">
        <Link to="/agenda" className="text-sm text-primary font-medium hover:underline">
          Ver agenda completa →
        </Link>
      </div>
    </div>
  );
}