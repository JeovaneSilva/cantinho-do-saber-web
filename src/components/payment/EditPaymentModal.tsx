import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  DollarSign, CheckCircle } from 'lucide-react';
import { paymentSchema, PaymentFormData } from '@/lib/validations/payment';
import { useToast } from '@/hooks/use-toast';
import { Pagamento } from '@/services/pagamentos';
import { Modal } from '../ui/modal';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: any) => Promise<void>;
  payment: Pagamento | null;
}

export function EditPaymentModal({ isOpen, onClose, onSubmit, payment }: EditPaymentModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  // Observa o status para mostrar/esconder data de pagamento
  const statusAtual = watch('status');

  useEffect(() => {
    if (isOpen && payment) {
      reset({
        alunoId: String(payment.alunoId), // Apenas para validar, fica disabled
        mesReferencia: payment.mesReferencia,
        dataVencimento: payment.dataVencimento ? new Date(payment.dataVencimento).toISOString().split('T')[0] : '',
        valor: String(payment.valor).replace('.', ','),
        status: payment.status,
        dataPagamento: payment.dataPagamento ? new Date(payment.dataPagamento).toISOString().split('T')[0] : '',
      });
    }
  }, [isOpen, payment, reset]);

  const handleFormSubmit = async (data: PaymentFormData) => {
    if (!payment) return;
    try {
      const payload = {
        mesReferencia: data.mesReferencia,
        dataVencimento: data.dataVencimento,
        valor: Number(data.valor.replace(',', '.')),
        status: data.status,
        dataPagamento: data.status === 'PAGO' ? (data.dataPagamento || new Date().toISOString()) : null,
      };

      await onSubmit(payment.id, payload);
      toast({ title: 'Atualizado!', description: 'Pagamento atualizado com sucesso.' });
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: 'Erro', description: 'Falha ao atualizar.' });
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Pagamento`}
      description={`Aluno: ${payment.aluno.nome}`}
      icon={<DollarSign className="w-5 h-5 text-primary-foreground" />}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Status do Pagamento</label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              {...register('status')}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background appearance-none"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
          </div>
        </div>

        {/* Se for PAGO, pede a data */}
        {statusAtual === 'PAGO' && (
           <div className="animate-fade-in">
             <label className="block text-sm font-medium mb-1.5 text-success">Data do Pagamento</label>
             <input 
               {...register('dataPagamento')} 
               type="date" 
               className="w-full px-4 py-2.5 rounded-lg border border-success/30 bg-success/5 focus:border-success focus:ring-success/20" 
             />
           </div>
        )}

        {/* Campos Editáveis */}
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium mb-1.5">Vencimento</label>
              <input type="date" {...register('dataVencimento')} className="w-full px-4 py-2.5 rounded-lg border bg-background" />
           </div>
           <div>
              <label className="block text-sm font-medium mb-1.5">Valor (R$)</label>
              <input {...register('valor')} className="w-full px-4 py-2.5 rounded-lg border bg-background" />
           </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-border hover:bg-muted">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold">
            Salvar Alterações
          </button>
        </div>
      </form>
    </Modal>
  );
}