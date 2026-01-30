import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant: 'primary' | 'secondary' | 'accent' | 'success';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const variantStyles = {
  primary: 'gradient-primary',
  secondary: 'gradient-secondary',
  accent: 'gradient-accent text-accent-foreground',
  success: 'bg-success',
};

export function StatCard({ title, value, subtitle, icon: Icon, variant, trend }: StatCardProps) {
  return (
    <div className={cn("stat-card animate-fade-in", variantStyles[variant])}>
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2 font-display">{value}</p>
          {subtitle && (
            <p className="text-sm mt-1 opacity-80">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded",
                trend.isPositive ? "bg-white/20" : "bg-white/20"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs opacity-80">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
