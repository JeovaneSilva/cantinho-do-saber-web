import { api } from './api';

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
  async findAll() {
    const response = await api.get<Material[]>('/materiais-didaticos');
    return response.data;
  },

  async create(data: FormData) {
    const response = await api.post('/materiais-didaticos', data);
    return response.data;
  },

  async remove(id: number) {
    await api.delete(`/materiais-didaticos/${id}`);
  },
  
  getDownloadUrl(filename: string) {
      return `http://localhost:3000/uploads/${filename}`;
  }
};

export const materiaService = {
  async findAll() {
    const response = await api.get<Materia[]>('/materia');
    return response.data;
  },
};