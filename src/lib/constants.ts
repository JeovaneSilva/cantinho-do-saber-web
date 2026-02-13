import { DiaSemana } from "@/services/agenda";


export const PREDEFINED_TIMES = [
  '08:00', '09:00', '10:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const DAYS_OPTIONS = [
  { label: 'Segunda-feira', value: DiaSemana.SEGUNDA },
  { label: 'Terça-feira', value: DiaSemana.TERCA },
  { label: 'Quarta-feira', value: DiaSemana.QUARTA },
  { label: 'Quinta-feira', value: DiaSemana.QUINTA },
  { label: 'Sexta-feira', value: DiaSemana.SEXTA },
  { label: 'Sábado', value: DiaSemana.SABADO },
];