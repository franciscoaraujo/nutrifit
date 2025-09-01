import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div 
      className={`bg-[var(--background)] rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md ${onClick ? 'cursor-pointer hover:translate-y-[-5px]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`p-4 border-b border-gray-100 ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`p-4 border-t border-gray-100 bg-[var(--light)] ${className}`}>{children}</div>;
};