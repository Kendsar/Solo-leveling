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
import { avatarService } from '../services/AvatarService';

export type ExerciseType = "strength" | "cardio" | "isometric";

export interface ExerciseSet {
  reps?: number;
  weight?: number; // kg
  durationSec?: number; // for holds if needed per set
}

export interface Exercise {
  name: string;
  type: ExerciseType;
  sets?: ExerciseSet[]; // for strength / hybrid
  durationSec?: number; // isometric (plank, wall sit)
  durationMin?: number; // cardio
  distanceKm?: number; // optional cardio metric
  completed: boolean;
}

export interface DailyWorkout {
  title: string; // "Wed - Push Day"
  day: string;   // "Wed"
  dayDate: string;
  currentDate: boolean;
  disabled: boolean;
  isRestDay: boolean;

  exercises: Exercise[];

  done: boolean;
  doughnutProgress: number;
  xpEarned: number;
}

export interface HunterData {
  user: {
    firstName: string;
    lastName: string;
    level: number;
    profilePicture: string;
    profilePicturePath?: string;
    profilePictureUrl?: string | null;
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

  dailyWorkouts: DailyWorkout[];

  dailyHabits: Array<{
    habit: string;
    completed: boolean;
    xp: number;
  }>;

  weeklySummary: {
    totalXP: number;
    workoutsCompleted: number;
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

  // Resolve the current profile picture utilizing the swappable interface layer
  const avatarUrl = data.user.profilePicturePath
    ? avatarService.getAvatarUrl(data.user.profilePicturePath)
    : (data.user.profilePicture !== 'link' && data.user.profilePicture ? data.user.profilePicture : null);

  return {
    userId: "hunter-001", // Default local ID mapping sequence
    userName: `${data.user.firstName} ${data.user.lastName}`,
    rank: data.user.currentTitle,
    level: data.user.level,
    currentXP: data.user.experience,
    maxXP: data.user.xpForNextLevel,
    energyLevel: Math.round(energyLevel),
    profilePictureUrl: avatarUrl,
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
      tasksCompleted: data.weeklySummary.workoutsCompleted,
      goals: data.goals.length,
      focus: focusScore,
    },
  };
}

export function processWeeklyData() {
  const data = getHunterData();
  // Using the system date as context
  const today = new Date('2026-03-20');
  today.setHours(0, 0, 0, 0);

  return data.dailyWorkouts.map((day) => {
    const dayDate = new Date(day.dayDate);
    dayDate.setHours(0, 0, 0, 0);
    const isPast = dayDate < today;
    const isToday = dayDate.getTime() === today.getTime();
    const isFuture = dayDate > today;

    // Determine status
    let status: "completed" | "active" | "upcoming" | "locked";
    if (day.done) {
      status = "completed";
    } else if (isPast) {
      status = "locked";
    } else if (isToday) {
      status = "active";
    } else {
      status = "upcoming";
    }

    // Format date as DD/MM/YYYY
    const dd = String(dayDate.getDate()).padStart(2, '0');
    const mm = String(dayDate.getMonth() + 1).padStart(2, '0');
    const yyyy = dayDate.getFullYear();
    const dateStr = `${dd}/${mm}/${yyyy}`;

    // Extract title (e.g., "Mon - Push Day" -> "Push Day Workout")
    const titleParts = day.title.split(' - ');
    let title = titleParts.length > 1 ? titleParts[1] : day.title;
    if (!title.toLowerCase().includes('workout') && !title.toLowerCase().includes('rest')) {
      title += ' Workout';
    }

    // Process exercises for display
    const exercises = day.exercises.map(ex => {
      let details = "";
      if (ex.sets && ex.sets.length > 0) {
        const numSets = ex.sets.length;
        const avgReps = Math.round(ex.sets.reduce((sum, s) => sum + (s.reps || 0), 0) / numSets);
        const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0));
        details = `(${numSets} sets - ${avgReps} reps)`;
        if (maxWeight > 0) details += ` (${maxWeight}Kg)`;
      } else if (ex.durationMin) {
        details = `(${ex.durationMin} min)`;
        if (ex.distanceKm) details += ` (${ex.distanceKm}Km)`;
      } else if (ex.durationSec) {
        details = `(${ex.durationSec} sec)`;
      }
      return {
        name: ex.name,
        completed: ex.completed,
        details
      };
    });

    return {
      day: getDayName(day.day),
      date: dateStr,
      title,
      status,
      completionRate: day.doughnutProgress,
      exercises,
      isCurrentOrFuture: isToday || isFuture,
      isDisabled: isPast
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

export function processGoalsData() {
  return getHunterData().goals;
}

export function processHabitsData() {
  return getHunterData().dailyHabits;
}

export function processAchievementsData() {
  return getHunterData().achievements;
}