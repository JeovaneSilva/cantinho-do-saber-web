import { api } from './api';

// Enum do Prisma (certifique-se de que bate com o backend)
export enum TipoMaterial {
  PDF = 'PDF',
  IMAGEM = 'IMAGEM',
}

export interface Material {
  id: number;
  titulo: string;
  tipo: TipoMaterial;
  urlArquivo: string;
  totalDownloads: number;
  materiaId: number;
  materia?: {
    nome: string;
  };
  createdAt: string;
}

export interface Materia {
  id: number;
  nome: string;
}

export const materiaisService = {
  // Busca todos os materiais
  async findAll() {
    const response = await api.get<Material[]>('/materiais-didaticos');
    return response.data;
  },

  // Cria um novo material (Upload)
  async create(data: FormData) {
    // Importante: Não defina Content-Type manualmente, o browser faz isso para FormData
    const response = await api.post('/materiais-didaticos', data);
    return response.data;
  },

  // Deleta
  async remove(id: number) {
    await api.delete(`/materiais-didaticos/${id}`);
  },
  
  // Download (Incrementa contador e redireciona/baixa)
  getDownloadUrl(filename: string) {
      // Ajuste para a URL real do seu backend de arquivos estáticos
      return `http://localhost:3000/uploads/${filename}`;
  }
};

export const materiaService = {
  // Busca todas as matérias cadastradas
  async findAll() {
    const response = await api.get<Materia[]>('/materia');
    return response.data;
  },
};