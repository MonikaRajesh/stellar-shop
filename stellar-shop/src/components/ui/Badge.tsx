import { classNames } from '@/utils/format';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'stellar';
  className?: string;
}

const variants = {
  default: 'bg-soft text-base border-base',
  success: 'bg-success-500/10 text-success-500 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-500 border-warning-500/20',
  error: 'bg-error-500/10 text-error-500 border-error-500/20',
  info: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
  stellar: 'bg-stellar-500/10 text-stellar-600 dark:text-stellar-300 border-stellar-500/20',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={classNames(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  );
}
