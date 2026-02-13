import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserCheck, Activity } from 'lucide-react';
import { studentSchema, StudentFormData } from '@/lib/validations/student';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Aluno } from '@/services/alunos';
import { Modal } from '../ui/modal';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: any) => Promise<void>;
  student: Aluno | null;
}

export function EditStudentModal({ isOpen, onClose, onSubmit, student }: EditStudentModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    if (isOpen && student) {
      reset({
        nome: student.nome,
        status: student.status,
        nomeResponsavel: student.nomeResponsavel,
        telefoneResponsavel: student.telefoneResponsavel || '',
        mensalidade: String(student.mensalidade).replace('.', ','),
        observacao: student.observacao || '',
      });
    }
  }, [isOpen, student, reset]);

  const handleFormSubmit = async (data: StudentFormData) => {
    if (!student) return;

    try {
      const payload = {
        ...data,
        mensalidade: Number(data.mensalidade.replace(',', '.')),
        telefoneResponsavel: data.telefoneResponsavel || '',
        status: data.status,
      };

      await onSubmit(student.id, payload);

      toast({
        title: 'Aluno atualizado!',
        description: 'As alterações foram salvas.',
      });
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: 'Erro ao editar', description: 'Tente novamente.' });
    }
  };

  if (!isOpen || !student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar ${student.nome}`}
      description="Altere os dados abaixo"
      icon={<User className="w-5 h-5 text-primary-foreground" />}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Dados Cadastrais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome Completo</label>
              <input
                {...register('nome')}
                className={cn("w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all", errors.nome && "border-destructive")}
              />
               {errors.nome && <p className="mt-1 text-sm text-destructive">{errors.nome.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Situação</label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  {...register('status')}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-secondary" />
            Dados do Responsável
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome do Responsável</label>
              <input
                {...register('nomeResponsavel')}
                className={cn("w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all", errors.nomeResponsavel && "border-destructive")}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Telefone</label>
              <input
                {...register('telefoneResponsavel')}
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Mensalidade (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
              <input
                {...register('mensalidade')}
                className={cn("w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all", errors.mensalidade && "border-destructive")}
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Observações</label>
            <textarea
              {...register('observacao')}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Informações adicionais..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </Modal>
  );
}