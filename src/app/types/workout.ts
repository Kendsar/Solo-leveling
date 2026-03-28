// src/app/types/workout.ts

export type ExerciseType = 'strength' | 'cardio' | 'isometric' | string;

export interface ExerciseSet {
  id: string;
  reps?: number;
  weight?: number;
  unit?: string; // 'kg' | 'lb' | 'sec' | 'min' | 'km'
}

// Universal unified Exercise model
export interface Exercise {
  id: string;
  exerciseId: string;
  name: string;
  type?: ExerciseType;
  completed?: boolean;
  sets: ExerciseSet[];
  // For cardio/isometric variations
  durationSec?: number;
  durationMin?: number;
  distanceKm?: number;
}

// Workout data for Composer and Daily rendering
export interface Workout {
  id: string;
  name?: string;
  title?: string;
  exercises: Exercise[];
}

export interface WorkoutData {
  day: string;
  date: string;
  title: string;
  status: 'completed' | 'active' | 'upcoming' | 'locked';
  completionRate: number;
  exercises: Exercise[];
  isToday: boolean;
  isFuture: boolean;
  isDisabled: boolean;
  done?: boolean;
}

// Reference from the database for muscles/selection
export interface ExerciseDef {
  id: string;
  name: string;
  muscleIds: string[];
}

export interface Muscle {
  id: string;
  label: string;
  group: string;
}

export interface DayPlan {
  date: string;
  workout: Workout | null;
  restDay: boolean;
  completed: boolean;
}
