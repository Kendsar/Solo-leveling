import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus } from 'lucide-react';
import { MuscleVisualization } from './composer-components/MuscleVisualization';
import { ExerciseSelector } from './composer-components/ExerciseSelector';
import { ExerciseItem } from './composer-components/ExerciseItem';
import { useWorkout, Workout, WorkoutExercise, Exercise } from '../context/WorkoutComposerContext';

export function WorkoutComposer() {
    const { addWorkout, updateWorkout, workouts, exercises, setSelectedExerciseIds } = useWorkout();
    const [isCreating, setIsCreating] = useState(false);
    const [workoutName, setWorkoutName] = useState('');
    const [currentWorkout, setCurrentWorkout] = useState<WorkoutExercise[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [hoveredExerciseId, setHoveredExerciseId] = useState<string | null>(null);

    const highlightedMuscles = useMemo(() => {
        const exerciseIds = hoveredExerciseId
            ? [hoveredExerciseId]
            : currentWorkout.map((we) => we.exerciseId);

        const muscles = new Set<string>();
        exerciseIds.forEach((id) => {
            const exercise = exercises.find((e) => e.id === id);
            exercise?.muscleIds.forEach((muscleId) => muscles.add(muscleId));
        });

        const muscleArray = Array.from(muscles);
        setSelectedExerciseIds(muscleArray);
        return muscleArray;
    }, [currentWorkout, exercises, hoveredExerciseId, setSelectedExerciseIds]);

    const handleSelectExercise = (exercise: Exercise) => {
        const newWorkoutExercise: WorkoutExercise = {
            id: `we-${Date.now()}`,
            exerciseId: exercise.id,
            sets: [],
        };
        setCurrentWorkout([...currentWorkout, newWorkoutExercise]);
    };

    const handleUpdateExercise = (id: string, updated: WorkoutExercise) => {
        setCurrentWorkout(currentWorkout.map((we) => (we.id === id ? updated : we)));
    };

    const handleDeleteExercise = (id: string) => {
        setCurrentWorkout(currentWorkout.filter((we) => we.id !== id));
    };

    const handleSaveWorkout = () => {
        if (!workoutName.trim() || currentWorkout.length === 0) return;

        const workout: Workout = {
            id: editingId || `workout-${Date.now()}`,
            name: workoutName.trim(),
            exercises: currentWorkout,
        };

        if (editingId) {
            updateWorkout(editingId, workout);
        } else {
            addWorkout(workout);
        }

        setWorkoutName('');
        setCurrentWorkout([]);
        setIsCreating(false);
        setEditingId(null);
    };

    const handleEditWorkout = (workout: Workout) => {
        setWorkoutName(workout.name);
        setCurrentWorkout(workout.exercises);
        setEditingId(workout.id);
        setIsCreating(true);
    };

    const handleCancelEdit = () => {
        setWorkoutName('');
        setCurrentWorkout([]);
        setIsCreating(false);
        setEditingId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
                <div>
                    <MuscleVisualization highlightedMuscles={highlightedMuscles} />
                </div>

                <div className="relative border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 backdrop-blur-sm rounded-xl p-12 max-w-lg w-full text-center overflow-hidden">
                    {!isCreating ? (
                        <>
                            <div className="text-md text-cyan-100 uppercase tracking-wider mb-10"> Saved Workouts </div>
                            <div >
                                {workouts.length === 0 ? (
                                    <p className="text-sm text-gray-500">No workouts created yet</p>
                                ) : (
                                    <div className="grid gap-2">
                                        {workouts.map((workout) => (
                                            <div
                                                key={workout.id}
                                                onClick={() => handleEditWorkout(workout)}
                                                className="flex items-start gap-3 bg-slate-950/40 p-2.5 rounded border border-cyan-500/10 hover:border-cyan-500/30 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer" style={{ textAlign: 'start' }}>
                                                    <div className='flex flex-col flex-1'>
                                                        <span className='text-cyan-50'>
                                                            {workout.name}
                                                        </span>
                                                        <p className="text-sm text-gray-500">
                                                            {workout.exercises.length} exercise
                                                            {workout.exercises.length !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full py-2 flex items-center justify-center mt-10 gap-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition-colors group"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus className="group-hover:scale-110 transition-transform" />{' '}
                                Create New Workout
                            </motion.button>
                        </>
                    ) : (
                        <div className="max-w-lg w-full text-center overflow-hidden">
                            <input
                                type="text"
                                placeholder="Workout Name"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded mb-5 px-2.5 py-1.5 text-xs text-cyan-50 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                                autoFocus
                            />

                            <ExerciseSelector
                                onSelect={handleSelectExercise}
                                onHover={setHoveredExerciseId}
                            />

                            {currentWorkout.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm text-gray-600">Exercises</h3>
                                    {currentWorkout.map((we) => (
                                        <ExerciseItem
                                            key={we.id}
                                            workoutExercise={we}
                                            onChange={(updated) => handleUpdateExercise(we.id, updated)}
                                            onDelete={() => handleDeleteExercise(we.id)}
                                            onHover={setHoveredExerciseId}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSaveWorkout}
                                    disabled={!workoutName.trim() || currentWorkout.length === 0}
                                    className="flex-1"
                                >
                                    {editingId ? 'Update Workout' : 'Save Workout'}
                                </Button>
                                <Button variant="outline" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}