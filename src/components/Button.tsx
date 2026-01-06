import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-800 text-white hover:bg-blue-900 border-blue-800',
  secondary: 'bg-white text-blue-800 hover:bg-gray-50 border-blue-800',
  success: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-lg border
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
