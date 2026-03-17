/**
 * Hunter System Data Processing Utilities
 * 
 * This module processes the JSON data from user-data.json and transforms it
 * into the format required by the dashboard components.
 * 
 * Data Flow:
 * 1. JSON file is imported from /src/imports/pasted_text/user-data.json
 * 2. Data is typed using the HunterData interface
 * 3. Processing functions extract and transform data for specific components:
 *    - processUserData() -> TopCommandBar props
 *    - processSystemStats() -> CentralControlPanel props
 *    - processWeeklyData() -> WeeklyGrid props
 */

import hunterData from '../../imports/pasted_text/user-data.json';

export interface HunterData {
  user: {
    firstName: string;
    lastName: string;
    level: number;
    profilePicture: string;
    experience: number;
    xpForNextLevel: number;
    titles: Array<{
      title: string;
      levelRequired: number;
      unlocked: boolean;
    }>;
    currentTitle: string;
    inventory: Array<{
      name: string;
      quantity: number;
      effect: string;
    }>;
    streak: number;
    dailyReward: {
      xp: number;
      item: {
        name: string;
        rarity: string;
      };
    };
    sentiment: string;
    xpGainedToday: number;
  };
  goals: Array<{
    title: string;
    progress: number;
    target: number;
    xpReward: number;
  }>;
  achievements: Array<{
    title: string;
    xpReward: number;
    unlocked: boolean;
    dateUnlocked: string | null;
  }>;
  dailyTasks: Array<{
    day: string;
    date: string;
    tasks: Array<{
      title: string;
      completed: boolean;
      xp: number;
    }>;
    done: boolean;
    doughnutProgress: number;
    xpEarned: number;
  }>;
  dailyHabits: Array<{
    habit: string;
    completed: boolean;
    xp: number;
  }>;
  weeklySummary: {
    totalXP: number;
    tasksCompleted: number;
    habitsCompleted: number;
    completionRate: number;
    streakBonusXP: number;
  };
}

export function getHunterData(): HunterData {
  return hunterData as HunterData;
}

export function processUserData() {
  const data = getHunterData();
  
  // Calculate energy level based on streak and daily completion
  // Use a formula that considers streak strength
  const baseEnergy = Math.min(100, (data.user.streak / 20) * 100);
  const todayBonus = (data.user.xpGainedToday / 50) * 20;
  const energyLevel = Math.min(100, Math.max(50, baseEnergy + todayBonus));
  
  return {
    userName: `${data.user.firstName} ${data.user.lastName}`,
    rank: data.user.currentTitle,
    level: data.user.level,
    currentXP: data.user.experience,
    maxXP: data.user.xpForNextLevel,
    energyLevel: Math.round(energyLevel),
  };
}

export function processSystemStats() {
  const data = getHunterData();
  
  // Calculate focus score based on habits completion
  const completedHabits = data.dailyHabits.filter(h => h.completed).length;
  const focusScore = Math.round((completedHabits / data.dailyHabits.length) * 100);
  
  return {
    overallProgress: data.weeklySummary.completionRate,
    stats: {
      streak: data.user.streak,
      tasksCompleted: data.weeklySummary.tasksCompleted,
      goals: data.goals.length,
      focus: focusScore,
    },
  };
}

export function processWeeklyData() {
  const data = getHunterData();
  const today = new Date('2026-03-17'); // Current date from the user's context
  
  return data.dailyTasks.map((day) => {
    const dayDate = new Date(day.date);
    const isPast = dayDate < today;
    const isToday = dayDate.toDateString() === today.toDateString();
    const isFuture = dayDate > today;
    
    // Determine status
    let status: "completed" | "active" | "upcoming" | "locked";
    if (day.done) {
      status = "completed";
    } else if (isToday) {
      status = "active";
    } else if (isFuture) {
      status = "upcoming";
    } else {
      // Past but not completed - still show as active or upcoming
      status = "active";
    }
    
    // Format date as MM.DD
    const dateStr = `${String(dayDate.getMonth() + 1).padStart(2, '0')}.${String(dayDate.getDate()).padStart(2, '0')}`;
    
    return {
      day: getDayName(day.day),
      date: dateStr,
      status,
      completionRate: day.doughnutProgress,
      tasks: day.tasks.length,
    };
  });
}

function getDayName(shortDay: string): string {
  const dayMap: { [key: string]: string } = {
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday',
  };
  return dayMap[shortDay] || shortDay;
}