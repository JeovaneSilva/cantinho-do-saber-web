import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, DollarSign, UserCheck } from 'lucide-react';
import { studentSchema, StudentFormData } from '@/lib/validations/student';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Modal } from '../ui/modal';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function CreateStudentModal({ isOpen, onClose, onSubmit }: CreateStudentModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nome: '',
      nomeResponsavel: '',
      telefoneResponsavel: '',
      mensalidade: '',
      observacao: '',
    },
  });

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      const payload = {
        ...data,
        mensalidade: Number(data.mensalidade.replace(',', '.')),
        telefoneResponsavel: data.telefoneResponsavel || '',
      };

      await onSubmit(payload);

      toast({
        title: 'Aluno cadastrado!',
        description: `${data.nome} foi adicionado com sucesso.`,
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Erro ao cadastrar',
        description: 'Tente novamente.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Aluno"
      description="Preencha os dados para cadastrar"
      icon={<User className="w-5 h-5 text-primary-foreground" />}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Dados do Aluno
          </h3>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nome Completo *</label>
            <input {...register('nome')} className={cn("input-style w-full p-2.5 rounded-lg border bg-background", errors.nome && "border-destructive")} />
            {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome.message}</p>}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
             <UserCheck className="w-4 h-4 text-secondary" /> Dados do Responsável
          </h3>
          <div className="grid gap-4">
             <input {...register('nomeResponsavel')} placeholder="Nome do Responsável" className="w-full p-2.5 rounded-lg border bg-background" />
             <input {...register('telefoneResponsavel')} placeholder="Telefone" className="w-full p-2.5 rounded-lg border bg-background" />
          </div>
        </div>

        <div>
           <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
             <DollarSign className="w-4 h-4 text-success" /> Mensalidade
           </h3>
           <input {...register('mensalidade')} placeholder="250,00" className="w-full p-2.5 rounded-lg border bg-background" />
           <textarea {...register('observacao')} placeholder="Observações" className="w-full resize-none p-2.5 mt-4 rounded-lg border bg-background" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground">
            {isSubmitting ? 'Salvando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}