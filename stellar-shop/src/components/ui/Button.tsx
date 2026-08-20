import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { classNames } from '@/utils/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'gradient-stellar text-white shadow-[0_8px_24px_-8px_rgba(51,102,255,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(51,102,255,0.75)] hover:-translate-y-0.5',
  secondary: 'bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 hover:opacity-90 hover:-translate-y-0.5',
  ghost: 'text-base hover:bg-soft',
  outline: 'border border-base text-base hover:bg-soft hover:border-stellar-400',
  danger: 'bg-error-500 text-white hover:opacity-90',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-11 px-6 text-sm rounded-xl',
  lg: 'h-13 px-8 text-base rounded-xl',
  icon: 'h-10 w-10 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      )}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
