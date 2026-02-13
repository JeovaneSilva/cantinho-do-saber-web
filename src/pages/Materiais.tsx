import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Upload, FileText, Video, Image, Download, Folder, Grid, List, MoreVertical, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMateriais } from '@/hooks/useMateriais';
import { materiaisService, materiaService, TipoMaterial } from '@/services/materiais';
import { UploadMaterialModal } from '@/components/materials/UploadMaterialModal';

const typeConfig: Record<string, { icon: any, color: string, label: string }> = {
  [TipoMaterial.PDF]: { icon: FileText, color: 'bg-destructive/15 text-destructive', label: 'PDF' },
  [TipoMaterial.IMAGEM]: { icon: Image, color: 'bg-success/15 text-success', label: 'Imagem' },
};

export default function Materiais() {
  const { materiais, isLoading, refreshMateriais, deleteMaterial } = useMateriais();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Estado para armazenar as opções do filtro
  const [subjectOptions, setSubjectOptions] = useState<string[]>(['Todos']);
  const [selectedSubject, setSelectedSubject] = useState('Todos');

  // Busca as matérias ao carregar a tela para preencher o filtro
  useEffect(() => {
    materiaService.findAll().then((data) => {
      const nomes = data.map(m => m.nome);
      setSubjectOptions(['Todos', ...nomes]);
    }).catch(console.error);
  }, []);

  // Filtros
  const filteredMaterials = materiais.filter((material) => {
    const matchesSearch = material.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    // Verifica se a matéria do arquivo bate com o filtro selecionado
    // O operador ?. é importante caso o material venha sem matéria definida
    const matchesSubject = selectedSubject === 'Todos' || material.materia?.nome === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const stats = {
    pdf: materiais.filter(m => m.tipo === TipoMaterial.PDF).length,
    imagem: materiais.filter(m => m.tipo === TipoMaterial.IMAGEM).length,
    total: materiais.length
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Materiais Didáticos</h1>
            <p className="text-muted-foreground mt-1">Compartilhe e organize recursos educacionais</p>
          </div>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Upload className="w-5 h-5" />
            Upload Material
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-scale-in">
          <div className="card-educational text-center">
            <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mx-auto mb-2"><FileText className="w-6 h-6 text-destructive" /></div>
            <p className="text-2xl font-bold text-foreground">{stats.pdf}</p><p className="text-sm text-muted-foreground">PDFs</p>
          </div>
          <div className="card-educational text-center">
            <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center mx-auto mb-2"><Image className="w-6 h-6 text-success" /></div>
            <p className="text-2xl font-bold text-foreground">{stats.imagem}</p><p className="text-sm text-muted-foreground">Imagens</p>
          </div>
          <div className="card-educational text-center">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mx-auto mb-2"><Folder className="w-6 h-6 text-secondary" /></div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p><p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar materiais..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 outline-none" 
            />
          </div>
          
          {/* Select Dinâmico de Matérias */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-muted/50"
          >
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <div className="flex border border-border rounded-lg overflow-hidden shrink-0">
            <button onClick={() => setViewMode('grid')} className={cn("p-2.5", viewMode === 'grid' ? "bg-primary text-white" : "bg-card text-muted-foreground")}><Grid className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={cn("p-2.5", viewMode === 'list' ? "bg-primary text-white" : "bg-card text-muted-foreground")}><List className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Lista de Materiais */}
        {isLoading ? (
           <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filteredMaterials.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material, index) => {
                const config = typeConfig[material.tipo];
                const TypeIcon = config.icon;

                return (
                  <div key={material.id} className="card-educational group relative hover:border-primary/50 transition-all">
                    <button 
                      onClick={() => deleteMaterial(material.id)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.color)}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2" title={material.titulo}>{material.titulo}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                        {material.materia?.nome || 'Geral'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">{new Date(material.createdAt).toLocaleDateString('pt-BR')}</span>
                      <a 
                        href={materiaisService.getDownloadUrl(material.urlArquivo)} 
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                      >
                        <Download className="w-4 h-4" /> Baixar
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // LIST VIEW
            <div className="card-educational p-0 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50 text-left text-sm font-medium text-muted-foreground">
                            <th className="p-4 pl-6">Nome</th>
                            <th className="p-4">Matéria</th>
                            <th className="p-4">Data</th>
                            <th className="p-4 text-right pr-6">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMaterials.map(material => {
                             const config = typeConfig[material.tipo];
                             const TypeIcon = config.icon;
                             return (
                                <tr key={material.id} className="border-b hover:bg-muted/20 transition-colors">
                                    <td className="p-4 pl-6 flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.color)}>
                                            <TypeIcon className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-foreground">{material.titulo}</span>
                                    </td>
                                    <td className="p-4"><span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">{material.materia?.nome}</span></td>
                                    <td className="p-4 text-sm text-muted-foreground">{new Date(material.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 text-right pr-6 flex justify-end gap-2">
                                        <a href={materiaisService.getDownloadUrl(material.urlArquivo)} target="_blank" className="p-2 hover:bg-muted rounded-md text-primary"><Download className="w-4 h-4" /></a>
                                        <button onClick={() => deleteMaterial(material.id)} className="p-2 hover:bg-destructive/10 rounded-md text-destructive"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                             )
                        })}
                    </tbody>
                </table>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-muted-foreground">Nenhum material encontrado.</div>
        )}
      </div>

      <UploadMaterialModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSuccess={refreshMateriais} />
    </MainLayout>
  );
}