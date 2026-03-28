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

import { Cpu } from 'lucide-react';
import hunterData from '../../imports/pasted_text/user-data.json';
import { WorkoutData, Exercise, ExerciseSet, ExerciseType } from '../types/workout';
import { avatarService } from '../services/AvatarService';

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

export function getTodayWorkout(): DailyWorkout[] {
  const data = getHunterData();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data.dailyWorkouts.filter((workout) => {
    const workoutDate = new Date(workout.dayDate);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate.getTime() === today.getTime();
  });
}

export function mapWorkoutToDayData(workouts: DailyWorkout[]): WorkoutData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return workouts.map((workout) => {
    const workoutDate = new Date(workout.dayDate);
    workoutDate.setHours(0, 0, 0, 0);

    // 🔥 STATUS LOGIC (based on your flags)
    let status: WorkoutData["status"] = "upcoming";

    if (workout.disabled) {
      status = "locked";
    } else if (workout.currentDate) {
      status = "active";
    } else if (workout.done) {
      status = "completed";
    }
    const dayDate = new Date(workout.dayDate);
    dayDate.setHours(0, 0, 0, 0);

    return {
      day: workout.day, // already provided
      date: workout.dayDate,
      title: workout.title,

      status,

      completionRate: workout.doughnutProgress || 0,

      exercises: workout.exercises.map((ex) => ({
        ...ex,
        name: ex.name,
        completed: ex.completed,
      })),
      isToday: dayDate.getTime() === today.getTime(),
      isFuture: workoutDate > today,
      isDisabled: workout.disabled,
    };
  });
}

export function processWeeklyData(): WorkoutData[] {
  const data = getHunterData();
  // Using the system date as context
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data.dailyWorkouts.map((dayWorkout) => {
    const dayDate = new Date(dayWorkout.dayDate);
    dayDate.setHours(0, 0, 0, 0);
    const isPast = dayDate < today;
    const isToday = dayDate.getTime() === today.getTime();
    const isFuture = dayDate > today;

    // Determine status
    let status: WorkoutData["status"] = "upcoming";
    if (dayWorkout.done) {
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
    const titleParts = dayWorkout.title.split(' - ');
    let title = titleParts.length > 1 ? titleParts[1] : dayWorkout.title;
    if (!title.toLowerCase().includes('workout') && !title.toLowerCase().includes('rest')) {
      title += ' Workout';
    }

    return {
      day: getDayName(dayWorkout.day),
      date: dateStr,
      title,
      status,
      completionRate: dayWorkout.doughnutProgress,
      exercises: dayWorkout.exercises,
      isToday: isToday,
      isFuture: isFuture,
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