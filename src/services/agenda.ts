import { api } from './api';

export enum DiaSemana {
  DOMINGO = 'DOMINGO',
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO'
}

export interface Aluno {
  id: number;
  nome: string;
}

export interface Aula {
  id: number;
  diaSemana: DiaSemana;
  horarioInicio: string;
  horarioFim: string;  
  observacoes?: string;
  alunos: Aluno[]; 
  professorId: number;
}

export interface CreateAulaData {
  diaSemana: DiaSemana;
  horarioInicio: string;
  horarioFim: string;
  alunosIds: number[];
}

export const aulasService = {
  async findAll(dia?: DiaSemana) {
    const url = dia ? `/aulas?dia=${dia}` : '/aulas';
    const response = await api.get<Aula[]>(url);
    return response.data;
  },

  async create(data: CreateAulaData) {
    const response = await api.post('/aulas', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateAulaData>) {
    const response = await api.patch(`/aulas/${id}`, data);
    return response.data;
  },

  async addAluno(aulaId: number, alunoId: number) {
    await api.patch(`/aulas/${aulaId}/adicionar-aluno/${alunoId}`);
  },

  async removeAluno(aulaId: number, alunoId: number) {
    await api.patch(`/aulas/${aulaId}/remover-aluno/${alunoId}`);
  },
  
  async delete(id: number) {
    await api.delete(`/aulas/${id}`);
  }
};