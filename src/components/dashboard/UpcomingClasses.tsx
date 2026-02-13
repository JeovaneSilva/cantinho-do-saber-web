import { Aula } from '@/services/agenda';
import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingClassesProps {
  aulas: Aula[];
}

export function UpcomingClasses({ aulas }: UpcomingClassesProps) {
  return (
    <div className="card-educational h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-bold text-foreground">Próximas Aulas</h3>
        <span className="text-xs text-muted-foreground">Hoje</span>
      </div>

      <div className="space-y-4">
        {aulas.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma aula agendada para hoje.</p>
        ) : (
          aulas.map((aula) => (
            <div key={aula.id} className="flex items-center p-3 rounded-lg bg-muted/30 border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">
                  {aula.alunos.map(a => a.nome.split(' ')[0]).join(', ')}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {/* Se tiver matéria no backend, mostre aqui. Ex: Matemática */}
                  Aula Regular
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-foreground">{aula.horarioInicio}</p>
                <p className="text-xs text-muted-foreground">até {aula.horarioFim}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/agenda" className="text-sm text-primary font-medium hover:underline">
          Ver agenda completa →
        </Link>
      </div>
    </div>
  );
}