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
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAlunos: 0,
    totalMateriais: 0,
    pagamentosPendentes: 0,
    aulasHojeCount: 0,
    aulasHoje: [],
    pagamentosRecentes: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const agora = new Date();

      const inicioSemana = new Date(agora);
      inicioSemana.setDate(agora.getDate() - agora.getDay());
      inicioSemana.setHours(0, 0, 0, 0);

    
      const diaEnumToIndex: Record<string, number> = {
        'DOMINGO': 0, 'SEGUNDA': 1, 'TERCA': 2, 'QUARTA': 3,
        'QUINTA': 4, 'SEXTA': 5, 'SABADO': 6
      };

      const [alunos, todasAulas, pagamentos, materiais] = await Promise.all([
        alunosService.findAll(),
        aulasService.findAll(), 
        pagamentosService.findAll(),
        materiaisService.findAll(),
      ]);

      const diasSemanaMap = [
        DiaSemana.DOMINGO, DiaSemana.SEGUNDA, DiaSemana.TERCA, 
        DiaSemana.QUARTA, DiaSemana.QUINTA, DiaSemana.SEXTA, DiaSemana.SABADO
      ];
      const diaHojeEnum = diasSemanaMap[agora.getDay()];

      const aulasDoDia = todasAulas.filter(a => a.diaSemana === diaHojeEnum);
      
      const aulasFuturas: Aula[] = [];
      const aulasPassadas: Aula[] = [];

      aulasDoDia.forEach(aula => {
        const [horaFim, minFim] = aula.horarioFim.split(':').map(Number);
        const dataFimAula = new Date(agora);
        dataFimAula.setHours(horaFim, minFim, 0, 0);

        if (dataFimAula < agora) {
          aulasPassadas.push(aula);
        } else {
          aulasFuturas.push(aula);
        }
      });

      const sortPorHorario = (a: Aula, b: Aula) => a.horarioInicio.localeCompare(b.horarioInicio);
      aulasFuturas.sort(sortPorHorario);
      aulasPassadas.sort(sortPorHorario);

      const aulasHojeOrdenadas = [...aulasFuturas, ...aulasPassadas];


      // --- LÓGICA DE AULAS REALIZADAS NA SEMANA ---
      // let aulasRealizadasCount = 0;

      // todasAulas.forEach(aula => {
      //   const diaIndex = diaEnumToIndex[aula.diaSemana];
        
      //   // Calcula a data exata dessa aula na semana atual
      //   const dataAulaFim = new Date(inicioSemana);
      //   dataAulaFim.setDate(inicioSemana.getDate() + diaIndex);
        
      //   const [horas, minutos] = aula.horarioFim.split(':').map(Number);
      //   dataAulaFim.setHours(horas, minutos, 0, 0);

      //   // Se a data/hora de término da aula é menor que AGORA, ela já aconteceu
      //   if (dataAulaFim < agora) {
      //     aulasRealizadasCount++;
      //   }
      // });
      
      const totalPendente = pagamentos
        .filter(p => p.status === 'PENDENTE')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);

      const ultimosPagamentos = pagamentos.slice(0, 5);

      setStats({
        totalAlunos: alunos.length,
        totalMateriais: materiais.length,
        pagamentosPendentes: totalPendente,
        aulasHojeCount: aulasFuturas.length, 
        aulasHoje: aulasHojeOrdenadas, 
        pagamentosRecentes: ultimosPagamentos,
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