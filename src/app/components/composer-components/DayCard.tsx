import { useDrop } from 'react-dnd';
import { motion } from 'motion/react';
import { Dumbbell, Moon, Lock, Check } from 'lucide-react';
import { DayPlan, Workout } from '../../context/WorkoutComposerContext';
import { useWorkout } from '../../context/WorkoutComposerContext';

interface DayCardProps {
  day: DayPlan;
  dayIndex: number;
  onDrop: (workout: Workout, dayIndex: number) => void;
  onToggleComplete: (dayIndex: number) => void;
  onToggleRestDay: (dayIndex: number) => void;
}

export function DayCard({
  day,
  dayIndex,
  onDrop,
  onToggleComplete,
  onToggleRestDay,
}: DayCardProps) {
  const { exercises } = useWorkout();
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'workout',
    canDrop: () => !day.completed,
    drop: (item: { workout: Workout }) => {
      onDrop(item.workout, dayIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const date = new Date(day.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateNum = date.getDate();

  const isDropActive = isOver && canDrop;

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.name || 'Unknown';
  };

  // Compute container border/bg classes based on state
  const containerClass = [
    'relative rounded-lg p-3 border transition-all duration-200 min-h-[100px] flex flex-col',
    isDropActive
      ? 'border-cyan-500/50 bg-cyan-950/30 shadow-[0_0_15px_rgba(34,211,238,0.08)]'
      : day.completed
        ? 'border-emerald-500/30 bg-emerald-950/40'
        : day.restDay
          ? 'border-slate-700/50 bg-slate-900/40'
          : canDrop
            ? 'border-cyan-500/10 bg-slate-950/60 hover:border-cyan-500/25'
            : 'border-cyan-500/10 bg-slate-950/60',
  ].join(' ');

  return (
    <motion.div
      ref={drop}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={containerClass}
    >
      {/* Drop-active glow overlay */}
      {isDropActive && (
        <div className="absolute inset-0 rounded-lg border border-cyan-400/30 pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] text-cyan-100/80 font-semibold uppercase tracking-wider">
            {dayName}
          </p>
          <p className="text-[10px] text-cyan-400/40 font-mono">{dateNum}</p>
        </div>
        {!day.restDay && (
          <button
            onClick={() => onToggleComplete(dayIndex)}
            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              day.completed
                ? 'bg-emerald-500/30 border-emerald-400/50'
                : 'border-slate-600 hover:border-cyan-500/50 hover:bg-cyan-500/10'
            }`}
          >
            {day.completed && <Check className="w-2.5 h-2.5 text-emerald-400" />}
            {day.completed && <Lock className="w-2.5 h-2.5 text-emerald-400 hidden" />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {day.restDay ? (
          <div className="text-center space-y-1.5 py-2">
            <Moon className="w-5 h-5 mx-auto text-slate-500" />
            <p className="text-[10px] text-slate-500">Rest day</p>
            <button
              onClick={() => onToggleRestDay(dayIndex)}
              className="text-[9px] text-slate-600 hover:text-slate-400 uppercase tracking-wider transition-colors"
            >
              Remove
            </button>
          </div>
        ) : day.workout ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-3 h-3 text-cyan-400/60 flex-shrink-0" />
              <span className="text-[10px] text-cyan-100 font-medium truncate">
                {day.workout.name}
              </span>
            </div>
            <div className="space-y-0.5">
              {day.workout.exercises.slice(0, 3).map((ex) => (
                <div key={ex.id} className="text-[9px] text-cyan-400/40 font-mono truncate">
                  · {getExerciseName(ex.exerciseId)}
                </div>
              ))}
              {day.workout.exercises.length > 3 && (
                <div className="text-[9px] text-cyan-400/30 font-mono">
                  +{day.workout.exercises.length - 3} more
                </div>
              )}
            </div>
            {!day.completed && (
              <button
                onClick={() => onToggleRestDay(dayIndex)}
                className="text-[9px] text-slate-600 hover:text-slate-400 uppercase tracking-wider transition-colors w-full text-center pt-1"
              >
                Set Rest Day
              </button>
            )}
          </div>
        ) : (
          <div className="text-center space-y-2 py-2">
            <p className="text-[10px] text-cyan-400/20 font-mono">
              {canDrop ? 'Drop here' : 'Empty'}
            </p>
            <button
              onClick={() => onToggleRestDay(dayIndex)}
              className="text-[9px] text-slate-600 hover:text-slate-400 uppercase tracking-wider border border-slate-700/50 rounded px-2 py-0.5 hover:border-slate-600 transition-all"
            >
              <Moon className="w-2.5 h-2.5 inline mr-1" />
              Rest
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}