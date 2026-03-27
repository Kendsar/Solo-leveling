import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Button } from '../../components/ui/button';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { WorkoutExercise, Set, Exercise } from '../../context/WorkoutComposerContext';
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
    <div
      className="flex items-start gap-3 bg-slate-950/40 p-2.5 rounded border border-cyan-500/10 hover:border-cyan-500/30 transition-colors cursor-pointer"
      onMouseEnter={() => onHover?.(workoutExercise.exerciseId)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="size-4 text-gray-400" />
          <h4 className="text-cyan-50 text-sm">{exercise?.name || 'Unknown Exercise'}</h4>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </div>

      {workoutExercise.sets.length > 0 && (
        <div className="space-y-2">
          {workoutExercise.sets.map((set, index) => (
            <div key={set.id} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-6">{index + 1}</span>
              <Input
                type="number"
                placeholder="Reps"
                value={set.reps || ''}
                onChange={(e) =>
                  updateSet(set.id, {
                    reps: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-20"
              />
              <span className="text-sm text-gray-500">×</span>
              <Input
                type="number"
                placeholder="Weight"
                value={set.weight || ''}
                onChange={(e) =>
                  updateSet(set.id, {
                    weight: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className="w-24"
              />
              <select
                value={set.unit}
                onChange={(e) =>
                  updateSet(set.id, { unit: e.target.value as 'kg' | 'lb' })
                }
                className="border rounded px-2 py-1.5 text-sm"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSet(set.id)}
              >
                <Trash2 className="size-3 text-gray-400" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full py-2 flex items-center justify-center gap-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition-colors group"
        onClick={addSet}
      >
        <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{' '}
        Add Set
      </motion.button>

    </div>
  );
}
