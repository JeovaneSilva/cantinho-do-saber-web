import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, UserPlus, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PREDEFINED_TIMES, DAYS_OPTIONS } from '@/lib/constants';
import { Aula, aulasService } from '@/services/agenda';
import { Aluno, alunosService } from '@/services/alunos';
import { Modal } from '../ui/modal';

interface ClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aula: Aula | null;
  onUpdate: () => void;
}

export function ClassDetailsModal({ isOpen, onClose, aula, onUpdate }: ClassDetailsModalProps) {
  const { toast } = useToast();
  const [allStudents, setAllStudents] = useState<Aluno[]>([]);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (isOpen && aula) {
      reset({ diaSemana: aula.diaSemana, horarioInicio: aula.horarioInicio });
      alunosService.findAll().then(setAllStudents);
    }
  }, [isOpen, aula, reset]);

  const handleUpdateClass = async (data: any) => {
    if (!aula) return;
    try {
      const [hour] = data.horarioInicio.split(':');
      const nextHour = String(Number(hour) + 1).padStart(2, '0');
      await aulasService.update(aula.id, { ...data, horarioFim: `${nextHour}:00` });
      toast({ title: 'Horário atualizado!' });
      onUpdate();
      onClose();
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao atualizar' });
    }
  };

  const handleAddStudent = async () => {
    if (!aula || !selectedStudentToAdd) return;
    try {
      await aulasService.addAluno(aula.id, Number(selectedStudentToAdd));
      toast({ title: 'Aluno adicionado.' });
      setSelectedStudentToAdd("");
      onUpdate(); 
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao adicionar' });
    }
  };

  const handleRemoveStudent = async (id: number) => {
    if (!aula) return;
    try {
      await aulasService.removeAluno(aula.id, id);
      
      toast({ description: 'Aluno removido da aula.' });
      
      onUpdate(); 
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao remover' });
    }
  };

  const handleDeleteClass = async () => {
    if (!aula || !confirm('Excluir esta aula?')) return;
    await aulasService.delete(aula.id);
    onUpdate();
    onClose();
  };

  if (!aula) return null;

  const studentsInClassIds = aula.alunos.map(a => a.id);
  const studentsAvailable = allStudents.filter(s => !studentsInClassIds.includes(s.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Aula" description="Edite horário ou alunos" icon={<Users className="w-5 h-5 text-primary-foreground" />}>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(handleUpdateClass)} className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/> Horário</h4>
          <div className="grid grid-cols-2 gap-3">
            <select {...register('diaSemana')} className="w-full p-2 rounded-md border text-sm">{DAYS_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select>
            <select {...register('horarioInicio')} className="w-full p-2 rounded-md border text-sm">{PREDEFINED_TIMES.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <button type="submit" className="w-full py-2 bg-primary/10 text-primary text-sm font-medium rounded-md hover:bg-primary/20 transition-colors">Salvar Horário</button>
        </form>

        <div>
          <h4 className="font-semibold text-sm mb-3">Alunos Matriculados ({aula.alunos.length})</h4>
          <div className="space-y-2 mb-3 max-h-[200px] overflow-y-auto">
            {aula.alunos.length === 0 && <p className="text-sm text-muted-foreground italic">Nenhum aluno nesta aula.</p>}
            
            {aula.alunos.map(aluno => (
              <div key={aluno.id} className="flex justify-between items-center p-2 rounded-lg bg-card border border-border animate-fade-in">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {aluno.nome.charAt(0)}
                   </div>
                   <span className="text-sm font-medium">{aluno.nome}</span>
                </div>
                <button 
                  onClick={() => handleRemoveStudent(aluno.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Remover com um clique"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 pt-2 border-t border-border">
            <select value={selectedStudentToAdd} onChange={(e) => setSelectedStudentToAdd(e.target.value)} className="flex-1 p-2 rounded-md border text-sm bg-background">
              <option value="">Adicionar aluno...</option>
              {studentsAvailable.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
            <button onClick={handleAddStudent} disabled={!selectedStudentToAdd} className="p-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50 hover:opacity-90"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-between items-center">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:underline">Fechar</button>
          <button onClick={handleDeleteClass} className="text-sm text-destructive hover:underline">Cancelar Aula</button>
        </div>
      </div>
    </Modal>
  );
}