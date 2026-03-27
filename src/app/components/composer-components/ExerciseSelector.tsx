import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from '../../components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useWorkout, Exercise } from '../../context/WorkoutComposerContext';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onHover?: (exerciseId: string | null) => void;
}

export function ExerciseSelector({ onSelect, onHover }: ExerciseSelectorProps) {
  const { exercises, addExercise } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [customName, setCustomName] = useState('');

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustom = () => {
    if (customName.trim()) {
      const customExercise: Exercise = {
        id: `custom-${Date.now()}`,
        name: customName.trim(),
        muscleIds: [],
      };
      addExercise(customExercise);
      onSelect(customExercise);
      setCustomName('');
      setIsAdding(false);
      setSearchTerm('');
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search exercises.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded mb-5 px-2.5 py-1.5 text-xs text-cyan-50 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          autoFocus
        />

      </div>

      {searchTerm && (
        <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => {
                  onSelect(exercise);
                  setSearchTerm('');
                }}
                onMouseEnter={() => onHover?.(exercise.id)}
                onMouseLeave={() => onHover?.(null)}
                className="w-full px-4 py-2 text-left bg-gray-50 transition-colors"
              >
                {exercise.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">No exercises found</div>
          )}
        </div>
      )}

      {!isAdding ? (
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <Plus className="size-4 mr-2" />
          Add Custom Exercise
        </Button>
      ) : (
        <div className="flex gap-2">
          <input
            placeholder="Custom exercise name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            className="w-full bg-slate-900 border border-slate-700 rounded mb-5 px-2.5 py-1.5 text-xs text-cyan-50 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            autoFocus
          />
          <Button onClick={handleAddCustom} size="sm">
            Add
          </Button>
          <Button
            onClick={() => {
              setIsAdding(false);
              setCustomName('');
            }}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}