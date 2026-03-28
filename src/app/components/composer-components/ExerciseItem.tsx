import { motion } from 'motion/react';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { WorkoutExercise, Set } from '../../context/WorkoutComposerContext';
import { useWorkout } from '../../context/WorkoutComposerContext';

interface ExerciseItemProps {
  workoutExercise: WorkoutExercise;
  onChange: (updatedExercise: WorkoutExercise) => void;
  onDelete: () => void;
  onHover?: (exerciseId: string | null) => void;
}

export function ExerciseItem({
  workoutExercise,
  onChange,
  onDelete,
  onHover,
}: ExerciseItemProps) {
  const { exercises, weightUnit } = useWorkout();
  const exercise = exercises.find((e) => e.id === workoutExercise.exerciseId);

  const addSet = () => {
    const newSet: Set = {
      id: `set-${Date.now()}`,
      reps: undefined,
      weight: undefined,
      unit: weightUnit,
    };
    onChange({
      ...workoutExercise,
      sets: [...workoutExercise.sets, newSet],
    });
  };

  const updateSet = (setId: string, updates: Partial<Set>) => {
    onChange({
      ...workoutExercise,
      sets: workoutExercise.sets.map((set) =>
        set.id === setId ? { ...set, ...updates } : set
      ),
    });
  };

  const deleteSet = (setId: string) => {
    onChange({
      ...workoutExercise,
      sets: workoutExercise.sets.filter((set) => set.id !== setId),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 backdrop-blur-sm rounded-lg overflow-hidden  cursor-default p-3 space-y-3 transition-colors duration-200"
      onMouseEnter={() => onHover?.(workoutExercise.exerciseId)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Exercise header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-slate-600 flex-shrink-0 cursor-grab" />
          <span className="text-sm text-cyan-50 font-medium truncate">
            {exercise?.name || 'Unknown Exercise'}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="flex-shrink-0 p-1 rounded text-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sets */}
      {workoutExercise.sets.length > 0 && (
        <div className="space-y-1.5">
          {/* Column labels */}
          <div className="flex items-center gap-2 px-0.5">
            <span className="w-5 text-[10px] text-cyan-400/30 font-mono">#</span>
            <span className="w-20 text-[10px] text-cyan-400/30 uppercase tracking-wider">Reps</span>
            <span className="text-[10px] text-cyan-400/20 select-none">×</span>
            <span className="w-24 text-[10px] text-cyan-400/30 uppercase tracking-wider">Weight</span>
            <span className="w-16 text-[10px] text-cyan-400/30 uppercase tracking-wider">Unit</span>
          </div>

          {workoutExercise.sets.map((set, index) => (
            <div key={set.id} className="flex items-center gap-2">
              {/* Set number */}
              <span className="w-5 text-xs text-cyan-400/30 font-mono text-center flex-shrink-0">
                {index + 1}
              </span>

              {/* Reps */}
              <input
                type="number"
                placeholder="—"
                value={set.reps ?? ''}
                onChange={(e) =>
                  updateSet(set.id, {
                    reps: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-cyan-50 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors text-center"
              />

              <span className="text-cyan-400/20 text-xs select-none">×</span>

              {/* Weight */}
              <input
                type="number"
                placeholder="—"
                value={set.weight ?? ''}
                onChange={(e) =>
                  updateSet(set.id, {
                    weight: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-cyan-50 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors text-center"
              />

              {/* Unit selector */}
              <select
                value={set.unit}
                onChange={(e) =>
                  updateSet(set.id, { unit: e.target.value as 'kg' | 'lb' })
                }
                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-cyan-100/80 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors cursor-pointer"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>

              {/* Delete set */}
              <button
                onClick={() => deleteSet(set.id)}
                className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 flex-shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add set button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-1.5 flex items-center justify-center gap-1.5 rounded bg-cyan-500/5 border border-cyan-500/20 text-cyan-400/60 text-[10px] uppercase tracking-wider hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/40 transition-all duration-150 group"
        onClick={addSet}
      >
        <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
        Add Set
      </motion.button>
    </motion.div>
  );
}
