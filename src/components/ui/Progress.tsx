import { HTMLAttributes, forwardRef } from 'react';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>((
  { 
    value = 0,
    max = 100,
    size = 'md',
    variant = 'default',
    className = '',
    ...props 
  }, 
  ref
) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const variantClasses = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  return (
    <div 
      ref={ref}
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <div 
        className={`h-full transition-all duration-300 ease-in-out ${variantClasses[variant]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

Progress.displayName = 'Progress';

export default Progress;
export { Progress };