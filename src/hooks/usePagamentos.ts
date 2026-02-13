import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Pagamento, pagamentosService } from '@/services/pagamentos';

// Função auxiliar para pegar o mês atual em português (Capitalizado)
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
  // Estado do mês selecionado (começa com o mês atual)
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  
  const { toast } = useToast();

  const fetchPagamentos = useCallback(async () => {
    try {
      setIsLoading(true);
      // Passa o mês selecionado para o service
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
  }, [selectedMonth, toast]); // Recria a função se o mês mudar

  // Dispara sempre que o mês mudar
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
    selectedMonth,      // Exporta para a tela usar no select
    setSelectedMonth,   // Exporta para a tela mudar
    refreshPagamentos: fetchPagamentos,
    createPagamento, 
    updatePagamento 
  };
}