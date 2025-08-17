/**
 * RPG-style level progression system
 * 
 * Level progression formula:
 * - XP needed for level N = 100 * (N - 1)^1.5
 * - This creates a progressive difficulty curve
 * 
 * Examples:
 * - Level 1: 0 XP (starting level)
 * - Level 2: 0 XP needed (0 total)
 * - Level 3: 100 XP needed (100 total)
 * - Level 4: 241 XP needed (341 total)
 * - Level 5: 424 XP needed (765 total)
 * - Level 10: 2,163 XP needed (3,409 total)
 */

/**
 * Calculate the XP needed to reach a specific level
 * @param level The target level (1-based)
 * @returns XP needed to reach that level from the previous level
 */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

/**
 * Calculate the cumulative XP needed to reach a specific level
 * @param level The target level (1-based)
 * @returns Total XP needed to reach that level from level 1
 */
export function getTotalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  
  let totalXp = 0;
  for (let i = 2; i <= level; i++) {
    totalXp += getXpForLevel(i);
  }
  return totalXp;
}

/**
 * Calculate current level and progress based on total XP
 * @param totalXp The user's total XP
 * @returns Object containing current level, XP into current level, XP needed for next level, and progress percentage
 */
export function calculateLevelProgress(totalXp: number): {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercentage: number;
  totalXpForCurrentLevel: number;
  totalXpForNextLevel: number;
} {
  if (totalXp < 0) totalXp = 0;
  
  let level = 1;
  let totalXpForCurrentLevel = 0;
  
  // Find the current level
  while (true) {
    const xpNeededForNextLevel = getXpForLevel(level + 1);
    const totalXpForNextLevel = totalXpForCurrentLevel + xpNeededForNextLevel;
    
    if (totalXp < totalXpForNextLevel) {
      // User is in this level
      const xpIntoLevel = totalXp - totalXpForCurrentLevel;
      const progressPercentage = xpNeededForNextLevel > 0 
        ? Math.min(100, Math.max(0, (xpIntoLevel / xpNeededForNextLevel) * 100))
        : 100;
      
      return {
        level,
        xpIntoLevel,
        xpForNextLevel: xpNeededForNextLevel,
        progressPercentage,
        totalXpForCurrentLevel,
        totalXpForNextLevel
      };
    }
    
    level++;
    totalXpForCurrentLevel = totalXpForNextLevel;
  }
}