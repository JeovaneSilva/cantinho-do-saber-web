import { z } from 'zod';

export const studentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .trim()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  phone: z
    .string()
    .trim()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(20, 'Telefone inválido')
    .regex(/^[\d\s()+-]+$/, 'Telefone deve conter apenas números e caracteres válidos'),
  birthDate: z
    .string()
    .min(1, 'Data de nascimento é obrigatória'),
  guardianName: z
    .string()
    .trim()
    .min(3, 'Nome do responsável deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do responsável deve ter no máximo 100 caracteres'),
  guardianPhone: z
    .string()
    .trim()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(20, 'Telefone inválido')
    .regex(/^[\d\s()+-]+$/, 'Telefone deve conter apenas números e caracteres válidos'),
  address: z
    .string()
    .trim()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
  subjects: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma matéria'),
  monthlyFee: z
    .string()
    .min(1, 'Valor da mensalidade é obrigatório')
    .refine((val) => !isNaN(Number(val.replace(',', '.'))) && Number(val.replace(',', '.')) > 0, {
      message: 'Valor deve ser maior que zero',
    }),
  notes: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const availableSubjects = [
  'Matemática',
  'Português',
  'Ciências',
  'História',
  'Geografia',
  'Física',
  'Química',
  'Biologia',
  'Inglês',
  'Espanhol',
  'Redação',
  'Literatura',
];
