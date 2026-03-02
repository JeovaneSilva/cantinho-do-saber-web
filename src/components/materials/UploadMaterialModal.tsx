import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Files } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Materia, materiaisService, materiaService } from '@/services/materiais';
import { alunosService } from '@/services/alunos'; 
import { Modal } from '../ui/modal';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadMaterialModal({ isOpen, onClose, onSuccess }: UploadMaterialModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();
  
  const [files, setFiles] = useState<File[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [alunos, setAlunos] = useState<{id: number, nome: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      materiaService.findAll().then(setMaterias).catch(console.error);
      alunosService.findAll().then(setAlunos).catch(console.error);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: any) => {
    if (files.length === 0) {
      toast({ variant: "destructive", title: "Arquivo obrigatório", description: "Selecione pelo menos um arquivo." });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('tipo', data.tipo);
      formData.append('materiaId', data.materiaId); 
      
      if (data.alunoId) {
         formData.append('alunoId', data.alunoId);
      }

      files.forEach(file => {
          formData.append('arquivos', file); 
      });

      await materiaisService.create(formData);
      
      toast({ title: "Upload concluído!", description: `${files.length} arquivo(s) enviados.` });
      
      reset();
      setFiles([]);
      onSuccess();
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro no upload", description: "Verifique os dados e tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload de Material"
      description="Compartilhe recursos com a turma ou com um aluno específico"
      icon={<Upload className="w-5 h-5 text-primary-foreground" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título do Material</label>
          <input {...register('titulo', { required: true })} className="input-style w-full p-2 rounded-md border bg-background" placeholder="Ex: Apostila de Frações" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Matéria (Obrigatório)</label>
            <select {...register('materiaId', { required: true })} className="input-style w-full p-2 rounded-md border bg-background">
              <option value="">Selecione...</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select {...register('tipo')} className="input-style w-full p-2 rounded-md border bg-background">
              <option value="PDF">PDF</option>
              <option value="IMAGEM">Imagem</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vincular a um Aluno Específico (Opcional)</label>
          <select {...register('alunoId')} className="input-style w-full p-2 rounded-md border bg-background">
            <option value="">Material Geral (Disponível para todos)</option>
            {alunos.map(a => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            id="file-upload" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.mp4"
            multiple 
          />
          <div className="flex flex-col items-center pointer-events-none">
            {files.length > 0 ? (
              <>
                <Files className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-foreground">{files.length} arquivo(s) selecionado(s)</span>
                <span className="text-xs text-muted-foreground truncate max-w-xs">{files[0].name} {files.length > 1 && '...'}</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-foreground">Clique ou arraste para selecionar</span>
                <span className="text-xs text-muted-foreground">Pode selecionar vários arquivos de uma vez</span>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-muted transition-colors">Cancelar</button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? 'Enviando...' : 'Fazer Upload'}
          </button>
        </div>
      </form>
    </Modal>
  );
}