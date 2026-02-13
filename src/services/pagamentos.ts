import { api } from './api';

export interface Pagamento {
  id: number;
  mesReferencia: string;
  dataVencimento: string;
  valor: string | number;
  status: 'PAGO' | 'PENDENTE' | 'ATRASADO';
  dataPagamento?: string | null;
  alunoId: number;
  aluno: {
    nome: string;
  };
}

export const pagamentosService = {
  async findAll(mes?: string) {
    const url = mes ? `/pagamentos?mes=${mes}` : '/pagamentos';
    const response = await api.get<Pagamento[]>(url);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/pagamentos', data);
    return response.data;
  },

  async update(id: number, data: Partial<Pagamento>) {
    const response = await api.patch(`/pagamentos/${id}`, data);
    return response.data;
  },

  async remove(id: number) {
    await api.delete(`/pagamentos/${id}`);
  }
};