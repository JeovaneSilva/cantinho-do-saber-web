import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Mail, Phone, Calendar, MapPin, BookOpen, DollarSign, FileText, UserCheck } from 'lucide-react';
import { studentSchema, StudentFormData, availableSubjects } from '@/lib/validations/student';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
}

export function StudentFormModal({ isOpen, onClose, onSubmit }: StudentFormModalProps) {
  const { toast } = useToast();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      subjects: [],
      notes: '',
    },
  });

  const toggleSubject = (subject: string) => {
    const newSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];
    
    setSelectedSubjects(newSubjects);
    setValue('subjects', newSubjects, { shouldValidate: true });
  };

  const handleFormSubmit = (data: StudentFormData) => {
    onSubmit(data);
    toast({
      title: 'Aluno cadastrado!',
      description: `${data.name} foi adicionado com sucesso.`,
    });
    reset();
    setSelectedSubjects([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedSubjects([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">
                Novo Aluno
              </h2>
              <p className="text-sm text-muted-foreground">
                Preencha os dados para cadastrar
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Dados do Aluno */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Dados do Aluno
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="Digite o nome do aluno"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors.name ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="aluno@email.com"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors.email ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors.phone ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Data de Nascimento *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('birthDate')}
                      type="date"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors.birthDate ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-destructive">{errors.birthDate.message}</p>
                  )}
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Endereço *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('address')}
                      type="text"
                      placeholder="Rua, número, bairro"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors.address ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dados do Responsável */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-secondary" />
                Dados do Responsável
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome do Responsável */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Nome do Responsável *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('guardianName')}
                      type="text"
                      placeholder="Nome completo"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors.guardianName ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.guardianName && (
                    <p className="mt-1 text-sm text-destructive">{errors.guardianName.message}</p>
                  )}
                </div>

                {/* Telefone do Responsável */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Telefone do Responsável *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('guardianPhone')}
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors.guardianPhone ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.guardianPhone && (
                    <p className="mt-1 text-sm text-destructive">{errors.guardianPhone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Matérias */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Matérias *
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                      selectedSubjects.includes(subject)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              {errors.subjects && (
                <p className="mt-2 text-sm text-destructive">{errors.subjects.message}</p>
              )}
            </div>

            {/* Valor e Observações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mensalidade */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  Mensalidade *
                </h3>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    R$
                  </span>
                  <input
                    {...register('monthlyFee')}
                    type="text"
                    placeholder="250,00"
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                      errors.monthlyFee ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.monthlyFee && (
                  <p className="mt-1 text-sm text-destructive">{errors.monthlyFee.message}</p>
                )}
              </div>

              {/* Observações */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Observações
                </h3>
                <textarea
                  {...register('notes')}
                  placeholder="Informações adicionais..."
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none",
                    errors.notes ? "border-destructive" : "border-border"
                  )}
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-destructive">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Cadastrar Aluno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
