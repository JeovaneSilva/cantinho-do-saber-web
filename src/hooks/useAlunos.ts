import { Aluno, alunosService } from '@/services/alunos';
import { useState, useEffect } from 'react';

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlunos = async () => {
    try {
      setIsLoading(true);
      const data = await alunosService.findAll();
      setAlunos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStudent = async (data: any) => {
    await alunosService.create(data);
    fetchAlunos();
  };


  const handleEditStudent = async (id: number, data: any) => {
    await alunosService.update(id, data);
    fetchAlunos();
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  return { alunos, isLoading, refreshAlunos: fetchAlunos, handleCreateStudent, handleEditStudent };
}