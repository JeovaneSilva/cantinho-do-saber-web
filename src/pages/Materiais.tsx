import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Upload, FileText, Video, Image, Download, Folder, Grid, List, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Material {
  id: number;
  name: string;
  type: 'pdf' | 'video' | 'image' | 'doc';
  subject: string;
  uploadDate: string;
  size: string;
  downloads: number;
}

const materials: Material[] = [
  { id: 1, name: 'Apostila de Matemática - Frações', type: 'pdf', subject: 'Matemática', uploadDate: '2025-01-15', size: '2.4 MB', downloads: 12 },
  { id: 2, name: 'Exercícios de Português - Verbos', type: 'doc', subject: 'Português', uploadDate: '2025-01-14', size: '856 KB', downloads: 8 },
  { id: 3, name: 'Vídeo Aula - Sistema Solar', type: 'video', subject: 'Ciências', uploadDate: '2025-01-12', size: '45 MB', downloads: 24 },
  { id: 4, name: 'Mapas do Brasil', type: 'image', subject: 'Geografia', uploadDate: '2025-01-10', size: '3.2 MB', downloads: 15 },
  { id: 5, name: 'Apostila de História - Era Medieval', type: 'pdf', subject: 'História', uploadDate: '2025-01-08', size: '5.1 MB', downloads: 7 },
  { id: 6, name: 'Exercícios de Física - Cinemática', type: 'pdf', subject: 'Física', uploadDate: '2025-01-05', size: '1.8 MB', downloads: 19 },
];

const typeConfig = {
  pdf: { icon: FileText, color: 'bg-destructive/15 text-destructive', label: 'PDF' },
  video: { icon: Video, color: 'bg-primary/15 text-primary', label: 'Vídeo' },
  image: { icon: Image, color: 'bg-success/15 text-success', label: 'Imagem' },
  doc: { icon: FileText, color: 'bg-secondary/15 text-secondary', label: 'Documento' },
};

const subjects = ['Todos', 'Matemática', 'Português', 'Ciências', 'Geografia', 'História', 'Física'];

export default function Materiais() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'Todos' || material.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Materiais Didáticos
            </h1>
            <p className="text-muted-foreground mt-1">
              Compartilhe e organize recursos educacionais
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity">
            <Upload className="w-5 h-5" />
            Upload Material
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up">
          <div className="card-educational text-center">
            <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mx-auto mb-2">
              <FileText className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-foreground">23</p>
            <p className="text-sm text-muted-foreground">PDFs</p>
          </div>
          <div className="card-educational text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-2">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">Vídeos</p>
          </div>
          <div className="card-educational text-center">
            <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center mx-auto mb-2">
              <Image className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">Imagens</p>
          </div>
          <div className="card-educational text-center">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mx-auto mb-2">
              <Folder className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">47</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Search, Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar materiais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === 'grid' ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === 'list' ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Materials Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
            {filteredMaterials.map((material, index) => {
              const config = typeConfig[material.type];
              const TypeIcon = config.icon;

              return (
                <div
                  key={material.id}
                  className="card-educational group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.color)}>
                      <TypeIcon className="w-6 h-6" />
                    </div>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {material.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                      {material.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">{material.size}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {new Date(material.uploadDate).toLocaleDateString('pt-BR')}
                    </span>
                    <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                      <Download className="w-4 h-4" />
                      {material.downloads}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-educational overflow-hidden p-0 animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Nome</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Tipo</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Matéria</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Tamanho</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Downloads</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => {
                    const config = typeConfig[material.type];
                    const TypeIcon = config.icon;

                    return (
                      <tr key={material.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.color)}>
                              <TypeIcon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-foreground">{material.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{config.label}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                            {material.subject}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{material.size}</td>
                        <td className="py-4 px-6 text-muted-foreground">{material.downloads}</td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {new Date(material.uploadDate).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum material encontrado.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
