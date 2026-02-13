import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode; 
}

export function Modal({ isOpen, onClose, title, description, icon, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}