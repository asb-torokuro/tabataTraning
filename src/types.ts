export type Phase = 'idle' | 'prepare' | 'work' | 'rest' | 'done';

export interface TimerSettings {
  workTime: number;
  restTime: number;
  sets: number;
  prepareTime: number;
  youtubeUrl: string;
}
