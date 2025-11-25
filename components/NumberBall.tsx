import React from 'react';

interface NumberBallProps {
  number: number;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
}

const NumberBall: React.FC<NumberBallProps> = ({ 
  number, 
  colorClass = 'bg-slate-700', 
  size = 'md',
  selected = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-bold'
  };

  const baseClasses = `
    rounded-full flex items-center justify-center 
    shadow-lg border-2 
    transition-all duration-300
    ${sizeClasses[size]}
  `;

  const stateClasses = selected 
    ? `${colorClass} border-white text-white scale-110 shadow-xl` 
    : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400';

  // If we pass a specific color class but it's not selected, we don't apply it fully
  // unless we want static balls (like in a results view).
  // Let's assume if colorClass is passed and it IS selected or static display, we use it.
  
  const finalClasses = selected || colorClass !== 'bg-slate-700'
    ? `${baseClasses} ${colorClass} border-white/20 text-white`
    : `${baseClasses} bg-slate-800 border-slate-600 text-slate-300`;

  return (
    <div className={finalClasses}>
      {number.toString().padStart(2, '0')}
    </div>
  );
};

export default NumberBall;
