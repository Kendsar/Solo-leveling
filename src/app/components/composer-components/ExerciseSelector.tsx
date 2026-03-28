import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
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
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Search exercises…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-cyan-50 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
        />
      </div>

      {/* Search results dropdown */}
      {searchTerm && (
        <div className="max-h-48 overflow-y-auto bg-slate-900 border border-cyan-500/20 rounded-lg divide-y divide-slate-800/60 shadow-lg shadow-black/40">
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
                className="w-full px-4 py-2.5 text-left text-sm text-cyan-100/80 hover:text-cyan-100 hover:bg-cyan-500/10 transition-colors"
              >
                {exercise.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-cyan-400/40 font-mono text-center">
              No exercises found
            </div>
          )}
        </div>
      )}

      {/* Add Custom Exercise */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider hover:bg-slate-800 hover:text-slate-300 hover:border-slate-600 transition-all duration-200 group"
        >
          <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Add Custom Exercise
        </button>
      ) : (
        <div className="space-y-2">
          <input
            placeholder="Custom exercise name…"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-50 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCustom}
              disabled={!customName.trim()}
              className="flex-1 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs uppercase tracking-wider hover:bg-cyan-500/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setCustomName('');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider hover:bg-slate-800 hover:text-slate-300 transition-all duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}