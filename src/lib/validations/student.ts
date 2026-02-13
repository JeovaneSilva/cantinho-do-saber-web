import { z } from 'zod';

export const studentSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  status: z.enum(['ATIVO', 'INATIVO']).optional(),
    
  nomeResponsavel: z
    .string()
    .trim()
    .min(3, 'Nome do responsável deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do responsável deve ter no máximo 100 caracteres'),
    
  telefoneResponsavel: z
    .string()
    .trim()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos (DDD + Número)')
    .max(20, 'Telefone inválido')
    .optional()
    .or(z.literal('')), 
    
  mensalidade: z
    .string()
    .min(1, 'Valor da mensalidade é obrigatório')
    .refine((val) => {
      const numberVal = Number(val.replace(',', '.'));
      return !isNaN(numberVal) && numberVal >= 0;
    }, {
      message: 'Valor inválido',
    }),
    
  observacao: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;