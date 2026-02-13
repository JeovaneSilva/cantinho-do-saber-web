import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Aula, aulasService, DiaSemana } from '@/services/agenda';
import { Pagamento, pagamentosService } from '@/services/pagamentos';
import { alunosService } from '@/services/alunos';
import { materiaisService } from '@/services/materiais';

export interface DashboardStats {
  totalAlunos: number;
  totalMateriais: number;
  pagamentosPendentes: number;
  aulasHojeCount: number;
  aulasHoje: Aula[];
  pagamentosRecentes: Pagamento[];
  resumoFinanceiroSemana: number;
  aulasRealizadasSemana: number; // Simulado para o exemplo
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAlunos: 0,
    totalMateriais: 0,
    pagamentosPendentes: 0,
    aulasHojeCount: 0,
    aulasHoje: [],
    pagamentosRecentes: [],
    resumoFinanceiroSemana: 0,
    aulasRealizadasSemana: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Converter dia de hoje (JS 0-6) para Enum do Prisma
      const diasSemanaMap = [
        DiaSemana.DOMINGO, DiaSemana.SEGUNDA, DiaSemana.TERCA, 
        DiaSemana.QUARTA, DiaSemana.QUINTA, DiaSemana.SEXTA, DiaSemana.SABADO
      ];
      const diaHojeEnum = diasSemanaMap[new Date().getDay()];

      // 2. Buscar dados em paralelo
      const [alunos, aulasHoje, pagamentos, materiais] = await Promise.all([
        alunosService.findAll(),
        aulasService.findAll(diaHojeEnum), // Busca só aulas de hoje
        pagamentosService.findAll(),
        materiaisService.findAll(),
      ]);

      // 3. Processar Pagamentos Pendentes
      const totalPendente = pagamentos
        .filter(p => p.status === 'PENDENTE')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);

      // 4. Processar Pagamentos da Semana (Exemplo: pagos recentemente)
      const totalSemana = pagamentos
        .filter(p => p.status === 'PAGO') // Idealmente filtraria por data
        .reduce((acc, curr) => acc + Number(curr.valor), 0);

      // 5. Ordenar Aulas por horário
      const aulasOrdenadas = aulasHoje.sort((a, b) => 
        a.horarioInicio.localeCompare(b.horarioInicio)
      );

      // 6. Pegar últimos 5 pagamentos
      const ultimosPagamentos = pagamentos
        .slice(0, 5); // Assumindo que o backend já traz ordenado ou ordenamos aqui

      setStats({
        totalAlunos: alunos.length,
        totalMateriais: materiais.length,
        pagamentosPendentes: totalPendente,
        aulasHojeCount: aulasHoje.length,
        aulasHoje: aulasOrdenadas,
        pagamentosRecentes: ultimosPagamentos,
        resumoFinanceiroSemana: totalSemana,
        aulasRealizadasSemana: aulasHoje.length * 5, // Simulação ou buscar histórico
      });

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao carregar dashboard" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, isLoading, refresh: fetchDashboardData };
}