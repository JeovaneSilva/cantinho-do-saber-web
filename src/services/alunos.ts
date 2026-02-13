import { api } from './api';

export interface Aluno {
  id: number;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
  dataMatricula: string;
  nomeResponsavel: string;
  telefoneResponsavel: string | null;
  mensalidade: string | number;
  statusPagamento: 'PAGO' | 'PENDENTE' | 'ATRASADO'; 
  observacao?: string
}

export interface CreateAlunoData {
  nome: string;
  nomeResponsavel: string;
  telefoneResponsavel: string;
  mensalidade: number;
  observacao?: string;
}

export const alunosService = {

 async findAll() {
    const response = await api.get<Aluno[]>('/alunos');
    return response.data;
  },

  async create(data: CreateAlunoData) {
    const response = await api.post<Aluno>('/alunos', data);
    return response.data;
  },

  async findById(id: number) {
    const response = await api.get<Aluno>(`/alunos/${id}`);
    return response.data;
  },

  async update(id: number, data: Partial<CreateAlunoData & { status: 'ATIVO' | 'INATIVO' }>) {
    const response = await api.patch<Aluno>(`/alunos/${id}`, data);
    return response.data;
  }
};