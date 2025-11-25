import React from 'react';
import { LotteryConfig } from '../types';
import { ChevronRight } from 'lucide-react';

interface LotteryCardProps {
  config: LotteryConfig;
  onClick: () => void;
}

const LotteryCard: React.FC<LotteryCardProps> = ({ config, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300
        hover:scale-[1.02] hover:shadow-2xl bg-slate-800 border border-slate-700
      `}
    >
      <div className={`absolute top-0 left-0 w-2 h-full ${config.color}`} />
      
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
            {config.name}
          </h3>
          <p className="text-slate-400 text-sm">
            Escolha {config.drawCount} números
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
      
      {/* Decorative background balls */}
      <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <div className={`w-24 h-24 rounded-full ${config.color}`} />
      </div>
    </button>
  );
};

export default LotteryCard;
