import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { materiaisService, Material } from '@/services/materiais';

export function useMateriais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMateriais = async () => {
    try {
      setIsLoading(true);
      const data = await materiaisService.findAll();
      setMateriais(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar materiais."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMaterial = async (id: number) => {
    if(!confirm("Tem certeza que deseja excluir este arquivo?")) return;
    try {
      await materiaisService.remove(id);
      toast({ title: "Material excluído." });
      fetchMateriais();
    } catch {
      toast({ variant: "destructive", title: "Erro ao excluir." });
    }
  }

  useEffect(() => {
    fetchMateriais();
  }, []);

  return { 
    materiais, 
    isLoading, 
    refreshMateriais: fetchMateriais,
    deleteMaterial
  };
}