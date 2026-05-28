import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-[#38BDF8] to-[#818CF8] text-white hover:shadow-[0_10px_20px_-5px_rgba(56,189,248,0.4)] hover:-translate-y-0.5 active:translate-y-0',
      secondary: 'bg-[#1E293B] text-white hover:bg-[#334155]',
      outline: 'border border-[#334155] text-[#94A3B8] hover:border-[#38BDF8] hover:text-[#38BDF8]',
      ghost: 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-13 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        ) : null}
        <span className={cn(isLoading && 'invisible')}>{children}</span>
      </button>
    );
  }
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: React.ReactNode }>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-[13px] font-medium text-[#94A3B8]">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-[48px] bg-[#1E293B]/60 border border-[#334155] rounded-xl px-4 text-[#F1F5F9] text-base placeholder:text-[#475569] transition-all focus:outline-none focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/10',
              icon && 'pl-11',
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-[#111827]/85 backdrop-blur-xl border border-[#38BDF8]/20 rounded-[32px] p-6 shadow-2xl', className)}>
    {children}
  </div>
);
