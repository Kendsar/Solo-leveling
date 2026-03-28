import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import exercisesData from '../../imports/pasted_text/exercises.json';
import musclesData from '../../imports/pasted_text/muscles.json';

import { ExerciseSet as Set, Exercise as WorkoutExercise, Workout, DayPlan, ExerciseDef as Exercise, Muscle } from '../types/workout';

export type { Set, WorkoutExercise, Workout, DayPlan, Exercise, Muscle };

interface WorkoutComposerContextType {
    exercises: Exercise[];
    muscles: Muscle[];
    workouts: Workout[];
    weeklyPlan: DayPlan[];
    currentMonth: Date;
    selectedExerciseIds: string[];
    weightUnit: 'kg' | 'lb';
    addExercise: (exercise: Exercise) => void;
    addWorkout: (workout: Workout) => void;
    updateWorkout: (id: string, workout: Workout) => void;
    deleteWorkout: (id: string) => void;
    updateDayPlan: (dayIndex: number, plan: Partial<DayPlan>) => void;
    setSelectedExerciseIds: (ids: string[]) => void;
    setWeightUnit: (unit: 'kg' | 'lb') => void;
    setCurrentMonth: (date: Date) => void;
    getMonthlyData: () => DayPlan[];
}

const WorkoutContext = createContext<WorkoutComposerContextType | undefined>(undefined);

const STORAGE_KEY = 'workout-app-data';

function generateWeeklyPlan(): DayPlan[] {
    const days: DayPlan[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        days.push({
            date: date.toISOString().split('T')[0],
            workout: null,
            restDay: false,
            completed: false,
        });
    }
    return days;
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [exercises, setExercises] = useState<Exercise[]>(exercisesData as Exercise[]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(generateWeeklyPlan);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
    const [historicalData, setHistoricalData] = useState<DayPlan[]>([]);

    // Load data from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setExercises(data.exercises || exercisesData);
                setWorkouts(data.workouts || []);
                setWeeklyPlan(data.weeklyPlan || generateWeeklyPlan());
                setHistoricalData(data.historicalData || []);
                setWeightUnit(data.weightUnit || 'kg');
            } catch (e) {
                console.error('Failed to parse stored data', e);
            }
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ exercises, workouts, weeklyPlan, historicalData, weightUnit })
        );
    }, [exercises, workouts, weeklyPlan, historicalData, weightUnit]);

    const addExercise = (exercise: Exercise) => {
        setExercises([...exercises, exercise]);
    };

    const addWorkout = (workout: Workout) => {
        setWorkouts([...workouts, workout]);
    };

    const updateWorkout = (id: string, workout: Workout) => {
        setWorkouts(workouts.map((w) => (w.id === id ? workout : w)));
    };

    const deleteWorkout = (id: string) => {
        setWorkouts(workouts.filter((w) => w.id !== id));
    };

    const updateDayPlan = (dayIndex: number, plan: Partial<DayPlan>) => {
        const newPlan = [...weeklyPlan];
        newPlan[dayIndex] = { ...newPlan[dayIndex], ...plan };

        // If marking as completed, archive to historical data
        if (plan.completed !== undefined) {
            const updatedDay = newPlan[dayIndex];
            const existingIndex = historicalData.findIndex(
                (d) => d.date === updatedDay.date
            );

            if (existingIndex >= 0) {
                const newHistorical = [...historicalData];
                newHistorical[existingIndex] = updatedDay;
                setHistoricalData(newHistorical);
            } else {
                setHistoricalData([...historicalData, updatedDay]);
            }
        }

        setWeeklyPlan(newPlan);
    };

    const getMonthlyData = (): DayPlan[] => {
        // Combine weekly plan and historical data
        const allData = [...weeklyPlan, ...historicalData];
        const uniqueData = allData.reduce((acc, day) => {
            if (!acc.find((d) => d.date === day.date)) {
                acc.push(day);
            }
            return acc;
        }, [] as DayPlan[]);

        return uniqueData.filter((day) => {
            const dayDate = new Date(day.date);
            return (
                dayDate.getMonth() === currentMonth.getMonth() &&
                dayDate.getFullYear() === currentMonth.getFullYear()
            );
        });
    };

    return (
        <WorkoutContext.Provider
            value={{
                exercises,
                muscles: musclesData as Muscle[],
                workouts,
                weeklyPlan,
                currentMonth,
                selectedExerciseIds,
                weightUnit,
                addExercise,
                addWorkout,
                updateWorkout,
                deleteWorkout,
                updateDayPlan,
                setSelectedExerciseIds,
                setWeightUnit,
                setCurrentMonth,
                getMonthlyData,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within WorkoutProvider');
    }
    return context;
}