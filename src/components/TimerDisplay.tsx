import React from 'react';
import { Phase } from '../types';
import { cn } from '../lib/utils';

interface Props {
  timeLeft: number;
  phase: Phase;
  currentSet: number;
  totalSets: number;
  settingsWork: number;
  settingsRest: number;
}

export const TimerDisplay: React.FC<Props> = ({
  timeLeft,
  phase,
  currentSet,
  totalSets,
}) => {
  const getPhaseColors = () => {
    switch (phase) {
      case 'prepare':
        return { text: 'text-[#10B981]', border: 'border-[#10B981]', bg: 'bg-[#10B981]' };
      case 'work':
        return { text: 'text-[#FF4D00]', border: 'border-[#FF4D00]', bg: 'bg-[#FF4D00]' };
      case 'rest':
        return { text: 'text-[#3B82F6]', border: 'border-[#3B82F6]', bg: 'bg-[#3B82F6]' };
      case 'done':
        return { text: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]', bg: 'bg-[#8B5CF6]' };
      default:
        return { text: 'text-gray-500', border: 'border-white/10', bg: 'bg-gray-500' };
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'prepare': return 'Get Ready';
      case 'work': return 'Work Phase';
      case 'rest': return 'Rest Phase';
      case 'done': return 'Session Complete';
      default: return 'Ready To Start';
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const colors = getPhaseColors();

  return (
    <>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[40px] rounded-full transition-colors duration-1000", colors.border)}></div>
      </div>
      
      <span className={cn("text-sm font-bold uppercase tracking-[0.3em] mb-4 transition-colors duration-300", colors.text)}>
        {getPhaseLabel()}
      </span>
      
      <div className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter tabular-nums text-white">
        {formatTime(timeLeft)}
      </div>
      
      <div className="mt-8 flex gap-2 sm:gap-3 flex-wrap justify-center px-4">
        {Array.from({ length: totalSets }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 w-8 sm:w-12 rounded-full transition-colors duration-300", 
              i < currentSet - 1 
                ? colors.bg 
                : i === currentSet - 1 
                  ? phase === 'idle' ? 'bg-white/20' : colors.bg
                  : 'bg-white/20'
            )}
          ></div>
        ))}
      </div>
      
      <div className="mt-6 text-gray-400 font-medium">
        Set {currentSet} of {totalSets}
      </div>
    </>
  );
};
