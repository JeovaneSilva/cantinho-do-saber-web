import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, Calendar, Users, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PREDEFINED_TIMES, DAYS_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { DiaSemana } from '@/services/agenda';
import { Aluno, alunosService } from '@/services/alunos';
import { Modal } from '../ui/modal';

const classSchema = z.object({
  diaSemana: z.nativeEnum(DiaSemana),
  horarioInicio: z.string().min(1, 'Horário obrigatório'),
});

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function ClassFormModal({ isOpen, onClose, onSubmit }: ClassFormModalProps) {
  const { toast } = useToast();
  const [availableStudents, setAvailableStudents] = useState<Aluno[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  
  // Estado para o Select de Alunos
  const [currentStudentSelect, setCurrentStudentSelect] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(classSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedStudentIds([]);
      alunosService.findAll().then(setAvailableStudents).catch(console.error);
    }
  }, [isOpen, reset]);

  const handleAddStudent = () => {
    if (!currentStudentSelect) return;
    const id = Number(currentStudentSelect);
    if (!selectedStudentIds.includes(id)) {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
    setCurrentStudentSelect("");
  };

  const removeStudent = (id: number) => {
    setSelectedStudentIds(selectedStudentIds.filter(s => s !== id));
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Calcula horário fim (Sempre +1 hora)
      const [hour] = data.horarioInicio.split(':');
      const nextHour = String(Number(hour) + 1).padStart(2, '0');
      const horarioFim = `${nextHour}:00`;

      await onSubmit({
        ...data,
        horarioFim,
        alunosIds: selectedStudentIds
      });

      toast({ title: 'Aula agendada!', description: 'Sucesso ao criar aula.' });
      onClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Conflito de horário ou erro no servidor.' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Aula"
      description="Agende um horário"
      icon={<Clock className="w-5 h-5 text-primary-foreground" />}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          {/* Dia da Semana */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Dia da Semana</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select {...register('diaSemana')} className="w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background">
                {DAYS_OPTIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Horário (Predefinido) */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Horário de Início</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select {...register('horarioInicio')} className="w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background">
                {PREDEFINED_TIMES.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seleção de Alunos */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Adicionar Alunos</label>
          <div className="flex gap-2">
            <select 
              value={currentStudentSelect}
              onChange={(e) => setCurrentStudentSelect(e.target.value)}
              className="flex-1 p-2.5 rounded-lg border bg-background"
            >
              <option value="">Selecione um aluno...</option>
              {availableStudents
                .filter(s => !selectedStudentIds.includes(s.id))
                .map(s => <option key={s.id} value={s.id}>{s.nome}</option>)
              }
            </select>
            <button 
              type="button" 
              onClick={handleAddStudent}
              className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Lista de Selecionados */}
          {selectedStudentIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedStudentIds.map(id => {
                const student = availableStudents.find(s => s.id === id);
                return (
                  <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {student?.nome}
                    <button type="button" onClick={() => removeStudent(id)}><X className="w-3 h-3" /></button>
                  </span>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-border">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold">
            Agendar Aula
          </button>
        </div>
      </form>
    </Modal>
  );
}