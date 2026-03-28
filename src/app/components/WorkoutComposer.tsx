import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Dumbbell } from 'lucide-react';
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
                {/* Muscle Visualization */}
                <div>
                    <MuscleVisualization highlightedMuscles={highlightedMuscles} />
                </div>

                {/* Composer Panel */}
                <div className="relative border border-cyan-500/20 bg-gradient-to-br from-slate-950/80 to-slate-900/80 backdrop-blur-xl rounded-xl p-6 overflow-hidden">
                    {/* Top glow line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                    {!isCreating ? (
                        <>
                            {/* Section header */}
                            <div className="flex items-center gap-3 mb-6">
                                <Dumbbell className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs text-cyan-400/70 uppercase tracking-widest">Saved Workouts</span>
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent" />
                            </div>

                            {workouts.length === 0 ? (
                                <p className="text-sm text-cyan-400/30 text-center py-6 font-mono">
                                    No workouts created yet
                                </p>
                            ) : (
                                <div className="grid gap-2 mb-6">
                                    {workouts.map((workout) => (
                                        <motion.div
                                            key={workout.id}
                                            onClick={() => handleEditWorkout(workout)}
                                            className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all duration-200 cursor-pointer group"
                                            whileHover={{ x: 2 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-400/20">
                                                <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                                            </div>
                                            <div className="flex flex-col flex-1 text-start">
                                                <span className="text-cyan-50 text-sm font-medium">
                                                    {workout.name}
                                                </span>
                                                <span className="text-xs text-cyan-400/40 font-mono">
                                                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-cyan-400/30 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                                Edit
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full py-2.5 flex items-center justify-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs uppercase tracking-wider hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200 group"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                Create New Workout
                            </motion.button>
                        </>
                    ) : (
                        <div className="space-y-5">
                            {/* Workout name input */}
                            <div>
                                <label className="block text-[10px] text-cyan-400/60 uppercase tracking-widest mb-2">
                                    Workout Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Push Day A"
                                    value={workoutName}
                                    onChange={(e) => setWorkoutName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-50 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
                                    autoFocus
                                />
                            </div>

                            {/* Exercise selector */}
                            <div>
                                <label className="block text-[10px] text-cyan-400/60 uppercase tracking-widest mb-2">
                                    Add Exercises
                                </label>
                                <ExerciseSelector
                                    onSelect={handleSelectExercise}
                                    onHover={setHoveredExerciseId}
                                />
                            </div>

                            {/* Selected exercises */}
                            {currentWorkout.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest">
                                            Exercises
                                        </span>
                                        <span className="text-[10px] font-mono text-cyan-400/30 ml-auto">
                                            {currentWorkout.length} added
                                        </span>
                                    </div>
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

                            {/* Action buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleSaveWorkout}
                                    disabled={!workoutName.trim() || currentWorkout.length === 0}
                                    className="flex-1 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs uppercase tracking-wider hover:bg-cyan-500/30 hover:border-cyan-500/60 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {editingId ? 'Update Workout' : 'Save Workout'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider hover:bg-slate-800 hover:text-slate-300 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bottom glow line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
                </div>
            </div>
        </motion.div>
    );
}