import React from 'react';
import { TimerSettings } from '../types';
import { Music } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  settings: TimerSettings;
  onChange: (settings: TimerSettings) => void;
  disabled: boolean;
}

export const SettingsPanel: React.FC<Props> = ({ settings, onChange, disabled }) => {
  const handleChange = (key: keyof TimerSettings, value: any) => {
    if (disabled) return;
    if (typeof value === 'number') {
      onChange({ ...settings, [key]: value > 0 ? value : 1 });
    } else {
      onChange({ ...settings, [key]: value });
    }
  };

  const adjustValue = (key: keyof TimerSettings, delta: number) => {
    if (disabled) return;
    const navVal = Number(settings[key]);
    if (!isNaN(navVal)) {
      handleChange(key, Math.max(1, navVal + delta));
    }
  };

  const SettingCard = ({ title, value, unit, keyName, valueColorClass, hoverClass }: any) => (
    <div className="bg-white/5 rounded-3xl p-4 flex flex-col justify-center border border-white/5">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</span>
      <div className="flex items-center justify-between">
        <span className={cn("text-2xl font-bold", valueColorClass)}>
          {value.toString().padStart(2, '0')}<span className="text-xs text-gray-500 ml-1">{unit}</span>
        </span>
        <div className="flex flex-col">
          <button 
            type="button"
            className={cn("text-gray-600 transition-colors disabled:opacity-30", hoverClass)}
            onClick={() => adjustValue(keyName, keyName === 'sets' ? 1 : 5)}
            disabled={disabled}
          >
            ▲
          </button>
          <button 
            type="button"
            className={cn("text-gray-600 transition-colors disabled:opacity-30", hoverClass)}
            onClick={() => adjustValue(keyName, keyName === 'sets' ? -1 : -5)}
            disabled={disabled}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timer Settings</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SettingCard 
          title="Work Time" 
          value={settings.workTime} 
          unit="SEC" 
          keyName="workTime" 
          valueColorClass="text-[#FF4D00]" 
          hoverClass="hover:text-[#FF4D00]" 
        />
        <SettingCard 
          title="Rest Time" 
          value={settings.restTime} 
          unit="SEC" 
          keyName="restTime" 
          valueColorClass="text-[#3B82F6]" 
          hoverClass="hover:text-[#3B82F6]" 
        />
        <SettingCard 
          title="Total Sets" 
          value={settings.sets} 
          unit="" 
          keyName="sets" 
          valueColorClass="text-white" 
          hoverClass="hover:text-white" 
        />
        <SettingCard 
          title="Prepare" 
          value={settings.prepareTime} 
          unit="SEC" 
          keyName="prepareTime" 
          valueColorClass="text-[#10B981]" 
          hoverClass="hover:text-[#10B981]" 
        />
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">YouTube Audio Integration</span>
        <div className="relative">
          <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Paste YouTube Music URL..."
            value={settings.youtubeUrl}
            onChange={(e) => handleChange('youtubeUrl', e.target.value)}
            disabled={disabled}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] disabled:opacity-50 transition-all font-mono placeholder:font-sans"
          />
        </div>
      </div>
    </div>
  );
};
