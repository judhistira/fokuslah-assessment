export interface UserProfile {
  totalXP: number;
  progress: number;
  streak: {
    current: number;
    longest: number;
  };
  hasActivityToday: boolean;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  levelProgress: number;
}