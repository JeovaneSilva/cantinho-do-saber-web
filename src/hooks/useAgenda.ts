import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Aula, aulasService, DiaSemana } from '@/services/agenda';

export function useAgenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mapa para converter index do Date.getDay() para Enum do Backend
  const dayMap: Record<number, DiaSemana> = {
    0: DiaSemana.DOMINGO,
    1: DiaSemana.SEGUNDA,
    2: DiaSemana.TERCA,
    3: DiaSemana.QUARTA,
    4: DiaSemana.QUINTA,
    5: DiaSemana.SEXTA,
    6: DiaSemana.SABADO,
  };

  const fetchAulas = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Descobre o dia da semana da data atual selecionada
      const dayIndex = currentDate.getDay();
      const diaEnum = dayMap[dayIndex];

      // 2. Busca no backend
      const data = await aulasService.findAll(diaEnum);
      setAulas(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a agenda."
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, toast]);

  useEffect(() => {
    fetchAulas();
  }, [fetchAulas]);

  // Função para navegar entre as datas
  const selectDate = (date: Date) => {
    setCurrentDate(date);
  };

  return {
    currentDate,
    aulas,
    isLoading,
    selectDate,
    refreshAgenda: fetchAulas
  };
}