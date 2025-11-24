import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = {
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    fontSize: '1rem',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      color: 'white',
      boxShadow: '0 0 20px var(--accent-glow)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    }
  };

  const style = {
    ...baseStyles,
    ...variants[variant],
  };

  return (
    <button 
      style={style} 
      className={className}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 0 30px var(--accent-glow)';
        } else {
          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
        } else {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
