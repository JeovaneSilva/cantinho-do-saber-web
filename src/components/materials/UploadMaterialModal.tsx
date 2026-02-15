import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Materia, materiaisService, materiaService } from '@/services/materiais';
import { Modal } from '../ui/modal';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadMaterialModal({ isOpen, onClose, onSuccess }: UploadMaterialModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();
  
  const [file, setFile] = useState<File | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      materiaService.findAll()
        .then(setMaterias)
        .catch(() => toast({ variant: 'destructive', title: 'Erro ao carregar matérias' }));
    }
  }, [isOpen, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    if (!file) {
      toast({ variant: "destructive", title: "Arquivo obrigatório" });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('tipo', data.tipo);
      formData.append('materiaId', data.materiaId); 
      formData.append('arquivo', file); 

      await materiaisService.create(formData);
      
      toast({ title: "Upload concluído!" });
      reset();
      setFile(null);
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
      description="Compartilhe recursos com os alunos"
      icon={<Upload className="w-5 h-5 text-primary-foreground" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título do Material</label>
          <input {...register('titulo', { required: true })} className="input-style w-full p-2 rounded-md border bg-background" placeholder="Ex: Apostila de Frações" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select {...register('tipo')} className="input-style w-full p-2 rounded-md border bg-background">
              <option value="PDF">PDF</option>
              <option value="IMAGEM">Imagem</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Matéria</label>
            <select {...register('materiaId', { required: true })} className="input-style w-full p-2 rounded-md border bg-background">
              <option value="">Selecione...</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            id="file-upload" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.mp4"
          />
          <div className="flex flex-col items-center pointer-events-none">
            {file ? (
              <>
                <FileText className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-foreground">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-foreground">Clique para selecionar</span>
                <span className="text-xs text-muted-foreground">PDF ou Imagem</span>
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