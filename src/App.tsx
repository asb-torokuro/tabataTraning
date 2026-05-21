import { useState, useEffect } from 'react';
import { TimerSettings, Phase } from './types';
import { playBeep } from './lib/audio';
import { YoutubePlayer } from './components/YoutubePlayer';
import { SettingsPanel } from './components/SettingsPanel';
import { TimerDisplay } from './components/TimerDisplay';
import { Play, Pause, Square } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [settings, setSettings] = useState<TimerSettings>({
    workTime: 20,
    restTime: 10,
    sets: 8,
    prepareTime: 5,
    youtubeUrl: '',
  });

  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(settings.workTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (phase === 'idle') {
      setTimeLeft(settings.workTime);
    }
  }, [settings.workTime, phase]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      if (phase === 'prepare') {
        playBeep(880, 'sine', 0.5);
        setPhase('work');
        setTimeLeft(settings.workTime);
      } else if (phase === 'work') {
        if (currentSet < settings.sets) {
          playBeep(300, 'square', 0.5);
          setPhase('rest');
          setTimeLeft(settings.restTime);
        } else {
          playBeep(880, 'sine', 1.0);
          setPhase('done');
          setIsRunning(false);
        }
      } else if (phase === 'rest') {
        playBeep(880, 'sine', 0.5);
        setCurrentSet((s) => s + 1);
        setPhase('work');
        setTimeLeft(settings.workTime);
      }
    } else if (isRunning && timeLeft > 0 && timeLeft <= 3) {
      playBeep(440, 'sine', 0.1);
    }
  }, [timeLeft, isRunning, phase, currentSet, settings]);

  const handleStart = () => {
    if (phase === 'idle' || phase === 'done') {
      setPhase('prepare');
      setCurrentSet(1);
      setTimeLeft(settings.prepareTime);
    }
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setPhase('idle');
    setCurrentSet(1);
    setTimeLeft(settings.workTime);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans flex flex-col overflow-x-hidden p-6">
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
        
        <header className="flex justify-between items-center mb-6 px-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">TABATA <span className="text-[#FF4D00]">FLOW</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Professional Interval Engine</p>
          </div>
          <div className="flex gap-4 items-center">
            {phase !== 'idle' && phase !== 'done' && (
              <div className="hidden sm:flex bg-white/5 border border-white/10 px-4 py-2 rounded-full items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-medium uppercase text-white/80">Active Session</span>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 flex-grow">
          
          {/* Main Timer Area */}
          <div className="col-span-1 lg:col-span-7 lg:row-span-4 bg-[#141416] border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden py-12 px-6">
            <TimerDisplay
              timeLeft={timeLeft}
              phase={phase}
              currentSet={currentSet}
              totalSets={settings.sets}
              settingsWork={settings.workTime}
              settingsRest={settings.restTime}
            />
          </div>

          {/* YouTube Player */}
          <div className="col-span-1 lg:col-span-5 lg:row-span-2 bg-[#141416] border border-white/10 rounded-[2.5rem] p-6 flex flex-col h-full min-h-[220px]">
             <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Audio Source</span>
             </div>
             <div className="flex-grow w-full rounded-2xl overflow-hidden border border-white/5 relative bg-black/50">
               <YoutubePlayer url={settings.youtubeUrl} />
             </div>
          </div>

          {/* Controls Area */}
          <div className="col-span-1 lg:col-span-7 lg:row-span-2 bg-[#FF4D00] rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-4">
             <div className="flex gap-4">
               <button
                 onClick={handleReset}
                 disabled={phase === 'idle' && !isRunning}
                 className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 disabled:opacity-50 disabled:hover:bg-black/20 text-white transition-opacity"
               >
                 <Square className="w-6 h-6" fill="currentColor" />
               </button>
               
               {!isRunning ? (
                 <button
                   onClick={handleStart}
                   className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
                 >
                   <Play className="w-10 h-10 text-[#FF4D00] ml-2" fill="currentColor" />
                 </button>
               ) : (
                 <button
                   onClick={handlePause}
                   className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
                 >
                   <Pause className="w-10 h-10 text-[#FF4D00]" fill="currentColor" />
                 </button>
               )}
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mt-2">
               {isRunning ? 'Pause Session' : 'Start Session'}
             </span>
          </div>

          {/* Settings Area */}
          <div className="col-span-1 lg:col-span-5 lg:row-span-4 bg-[#141416] border border-white/10 rounded-[2.5rem] p-6 flex flex-col overflow-y-auto">
            <SettingsPanel
              settings={settings}
              onChange={setSettings}
              disabled={isRunning || phase !== 'idle'}
            />
          </div>

        </div>

        <footer className="mt-4 flex justify-between items-center text-[10px] text-gray-600 px-2">
          <div className="flex gap-6 uppercase tracking-widest font-bold">
            <span>Version 2.0-PRO</span>
            <span>Hardware: Accelerated</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

