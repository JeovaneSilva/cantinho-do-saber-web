import { z } from 'zod';

export const paymentSchema = z.object({
  alunoId: z.string().min(1, 'Selecione um aluno'),
  
  mesReferencia: z
    .string()
    .min(1, 'Mês de referência é obrigatório'),
    
  dataVencimento: z
    .string()
    .min(1, 'Data de vencimento é obrigatória'),
    
  valor: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((val) => {
      const numberVal = Number(val.replace(',', '.'));
      return !isNaN(numberVal) && numberVal > 0;
    }, {
      message: 'Valor inválido',
    }),

  status: z.enum(['PAGO', 'PENDENTE', 'ATRASADO']).optional(),
  
  dataPagamento: z.string().optional().or(z.literal('')),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;