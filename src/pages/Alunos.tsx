import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Search,
  Plus,
  MoreVertical,
  Phone,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlunos } from "@/hooks/useAlunos";
import { CreateStudentModal } from '@/components/students/CreateStudentModal';
import { EditStudentModal } from '@/components/students/EditStudentModal'
import { Aluno } from "@/services/alunos";

const paymentConfig = {
  PAGO: { label: "Em dia", icon: CheckCircle, className: "badge-success" },
  PENDENTE: { label: "Pendente", icon: Clock, className: "badge-warning" },
  ATRASADO: {
    label: "Atrasado",
    icon: AlertCircle,
    className: "badge-destructive",
  },
};

const formatMoney = (val: string | number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(val));
};

export default function Alunos() {
  const { alunos, isLoading,handleCreateStudent, handleEditStudent } = useAlunos();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ATIVO" | "INATIVO">(
    "ALL",
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [studentToEdit, setStudentToEdit] = useState<Aluno | null>(null);


  const filteredStudents = alunos.filter((student) => {
    const matchesSearch =
      student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nomeResponsavel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "ALL" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });


  return (
    <MainLayout>
      <div className="space-y-6">
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
            onClick={() => setIsCreateOpen(true)} 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Novo Aluno
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por aluno ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={cn(
                "px-4 py-2.5 rounded-lg font-medium transition-all",
                filterStatus === "ALL"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus("ATIVO")}
              className={cn(
                "px-4 py-2.5 rounded-lg font-medium transition-all",
                filterStatus === "ATIVO"
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              Ativos
            </button>
            <button
              onClick={() => setFilterStatus("INATIVO")}
              className={cn(
                "px-4 py-2.5 rounded-lg font-medium transition-all",
                filterStatus === "INATIVO"
                  ? "bg-muted-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              Inativos
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {filteredStudents.length}
              </span>
              aluno{filteredStudents.length !== 1 ? "s" : ""} encontrado
              {filteredStudents.length !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStudents.map((student, index) => {
                const paymentInfo =
                  paymentConfig[student.statusPagamento] ||
                  paymentConfig["PENDENTE"];
                const PaymentIcon = paymentInfo.icon;

                return (
                  <div
                    key={student.id}
                    className="card-educational group"
                    style={{ animationDelay: `${index * 50}ms`, border: '0.5px solid #00000030' }}
                  >
                    <div className="flex items-start justify-between mb-4 ">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                          {student.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {student.nome}
                          </h3>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              student.status === "ATIVO"
                                ? "bg-success/15 text-success"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {student.status === "ATIVO" ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>
                     <button 
                  onClick={() => setStudentToEdit(student)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="truncate">
                          {student.nomeResponsavel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>
                          {student.telefoneResponsavel || "Sem telefone"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary flex items-center gap-1">
                        {formatMoney(student.mensalidade)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className={paymentInfo.className}>
                        <PaymentIcon className="w-3 h-3 mr-1 inline" />
                        {paymentInfo.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Desde{" "}
                        {new Date(student.dataMatricula).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum aluno encontrado.
                </p>
              </div>
            )}
          </>
        )}
      </div>

    <CreateStudentModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateStudent}
      />

      <EditStudentModal 
        isOpen={!!studentToEdit} 
        onClose={() => setStudentToEdit(null)}
        student={studentToEdit}
        onSubmit={handleEditStudent}
      />
    </MainLayout>
  );
}
