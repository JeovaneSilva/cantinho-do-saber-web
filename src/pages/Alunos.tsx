import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StudentFormModal } from '@/components/students/StudentFormModal';
import { StudentFormData } from '@/lib/validations/student';
import { Search, Plus, MoreVertical, Phone, Mail, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  subjects: string[];
  enrolledDate: string;
}

const initialStudents: Student[] = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-1234', status: 'active', paymentStatus: 'paid', subjects: ['Matemática', 'Física'], enrolledDate: '2024-03-15' },
  { id: 2, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-5678', status: 'active', paymentStatus: 'pending', subjects: ['Português', 'Redação'], enrolledDate: '2024-05-20' },
  { id: 3, name: 'Pedro Santos', email: 'pedro@email.com', phone: '(11) 99999-9012', status: 'inactive', paymentStatus: 'overdue', subjects: ['Ciências'], enrolledDate: '2024-01-10' },
  { id: 4, name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 99999-3456', status: 'active', paymentStatus: 'paid', subjects: ['História', 'Geografia'], enrolledDate: '2024-06-01' },
  { id: 5, name: 'Lucas Ferreira', email: 'lucas@email.com', phone: '(11) 99999-7890', status: 'active', paymentStatus: 'pending', subjects: ['Matemática'], enrolledDate: '2024-07-15' },
  { id: 6, name: 'Julia Mendes', email: 'julia@email.com', phone: '(11) 99999-2345', status: 'active', paymentStatus: 'paid', subjects: ['Inglês', 'Espanhol'], enrolledDate: '2024-04-22' },
];

const paymentConfig = {
  paid: { label: 'Em dia', icon: CheckCircle, className: 'badge-success' },
  pending: { label: 'Pendente', icon: Clock, className: 'badge-warning' },
  overdue: { label: 'Atrasado', icon: AlertCircle, className: 'badge-destructive' },
};

export default function Alunos() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddStudent = (data: StudentFormData) => {
    const newStudent: Student = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: 'active',
      paymentStatus: 'pending',
      subjects: data.subjects,
      enrolledDate: new Date().toISOString().split('T')[0],
    };
    setStudents([newStudent, ...students]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Alunos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os alunos cadastrados no sistema
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Novo Aluno
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={cn(
                "px-4 py-2.5 rounded-lg font-medium transition-all",
                filterStatus === 'all'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={cn(
                "px-4 py-2.5 rounded-lg font-medium transition-all",
                filterStatus === 'active'
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Ativos
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={cn(
                "px-4 py-2.5 rounded-lg font-medium transition-all",
                filterStatus === 'inactive'
                  ? "bg-muted-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Inativos
            </button>
          </div>
        </div>

        {/* Students Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filteredStudents.length}</span>
          aluno{filteredStudents.length !== 1 ? 's' : ''} encontrado{filteredStudents.length !== 1 ? 's' : ''}
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map((student, index) => {
            const paymentInfo = paymentConfig[student.paymentStatus];
            const PaymentIcon = paymentInfo.icon;
            
            return (
              <div
                key={student.id}
                className="card-educational group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        student.status === 'active' 
                          ? "bg-success/15 text-success" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {student.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {student.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className={paymentInfo.className}>
                    <PaymentIcon className="w-3 h-3 mr-1 inline" />
                    {paymentInfo.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Desde {new Date(student.enrolledDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum aluno encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
      />
    </MainLayout>
  );
}
