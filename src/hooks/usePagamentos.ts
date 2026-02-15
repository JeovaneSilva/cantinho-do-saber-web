import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Pagamento, pagamentosService } from '@/services/pagamentos';

const getCurrentMonth = () => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[new Date().getMonth()];
};

export function usePagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  
  const { toast } = useToast();

  const fetchPagamentos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await pagamentosService.findAll(selectedMonth);
      setPagamentos(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar pagamentos."
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, toast]); 

  useEffect(() => {
    fetchPagamentos();
  }, [fetchPagamentos]);

  const createPagamento = async (data: any) => {
    await pagamentosService.create(data);
    fetchPagamentos();
  };

  const updatePagamento = async (id: number, data: any) => {
    await pagamentosService.update(id, data);
    fetchPagamentos();
  };

  return { 
    pagamentos, 
    isLoading, 
    selectedMonth,  
    setSelectedMonth,  
    refreshPagamentos: fetchPagamentos,
    createPagamento, 
    updatePagamento 
  };
}