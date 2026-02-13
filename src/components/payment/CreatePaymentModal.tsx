import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Calendar, DollarSign, FileText } from 'lucide-react';
import { paymentSchema, PaymentFormData } from '@/lib/validations/payment';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Aluno, alunosService } from '@/services/alunos';
import { Modal } from '../ui/modal';

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function CreatePaymentModal({ isOpen, onClose, onSubmit }: CreatePaymentModalProps) {
  const { toast } = useToast();
  const [students, setStudents] = useState<Aluno[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      valor: '',
      mesReferencia: '',
      dataVencimento: '',
      status: 'PENDENTE',
    },
  });

  // Busca alunos para o Select
  useEffect(() => {
    if (isOpen) {
      reset();
      alunosService.findAll().then(setStudents).catch(console.error);
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: PaymentFormData) => {
    try {
      const payload = {
        ...data,
        alunoId: Number(data.alunoId), // Converte string do select para number
        valor: Number(data.valor.replace(',', '.')),
      };

      await onSubmit(payload);

      toast({ title: 'Pagamento criado!', description: 'O lançamento foi registrado.' });
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: 'Erro', description: 'Falha ao criar pagamento.' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Pagamento"
      description="Lance uma nova mensalidade"
      icon={<DollarSign className="w-5 h-5 text-primary-foreground" />}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Seleção de Aluno */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Aluno *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              {...register('alunoId')}
              className={cn("w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background appearance-none", errors.alunoId && "border-destructive")}
            >
              <option value="">Selecione...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>
          {errors.alunoId && <p className="text-xs text-destructive mt-1">{errors.alunoId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Mês Referência */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Mês Referência *</label>
            <div className="relative">
               <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input {...register('mesReferencia')} placeholder="Ex: Janeiro" className={cn("w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background", errors.mesReferencia && "border-destructive")} />
            </div>
            {errors.mesReferencia && <p className="text-xs text-destructive mt-1">{errors.mesReferencia.message}</p>}
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Valor (R$) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <input {...register('valor')} placeholder="250,00" className={cn("w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background", errors.valor && "border-destructive")} />
            </div>
            {errors.valor && <p className="text-xs text-destructive mt-1">{errors.valor.message}</p>}
          </div>
        </div>

        {/* Data Vencimento */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Data de Vencimento *</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              {...register('dataVencimento')} 
              type="date" 
              className={cn("w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background", errors.dataVencimento && "border-destructive")} 
            />
          </div>
          {errors.dataVencimento && <p className="text-xs text-destructive mt-1">{errors.dataVencimento.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-border hover:bg-muted">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg">
            {isSubmitting ? 'Salvando...' : 'Lançar Pagamento'}
          </button>
        </div>
      </form>
    </Modal>
  );
}