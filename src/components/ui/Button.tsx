import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white focus:ring-[var(--primary)]',
    secondary: 'bg-[var(--secondary)] hover:bg-[var(--secondary-dark)] text-white focus:ring-[var(--secondary)]',
    outline: 'border border-[var(--primary)] text-[var(--primary)] hover:bg-opacity-10 hover:bg-[var(--primary)] focus:ring-[var(--primary)]',
    ghost: 'text-[var(--primary)] hover:bg-opacity-10 hover:bg-[var(--primary)] focus:ring-[var(--primary)]'
  };
  
  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;