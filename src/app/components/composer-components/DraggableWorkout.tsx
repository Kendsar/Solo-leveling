import { useDrag } from 'react-dnd';
import { motion } from 'motion/react';
import { Dumbbell } from 'lucide-react';
import { Workout } from '../../context/WorkoutComposerContext';

interface DraggableWorkoutProps {
  workout: Workout;
}

export function DraggableWorkout({ workout }: DraggableWorkoutProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'workout',
    item: { workout },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      animate={{
        opacity: isDragging ? 0.4 : 1,
        scale: isDragging ? 0.96 : 1,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className="bg-slate-950/70 border border-cyan-500/15 hover:border-cyan-500/40 hover:bg-cyan-950/20 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-colors duration-200 group"
    >
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-cyan-500/10 border border-cyan-400/20 flex-shrink-0">
          <Dumbbell className="w-3 h-3 text-cyan-400" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs text-cyan-100 font-medium truncate">{workout.name}</h4>
          <p className="text-[10px] text-cyan-400/40 font-mono">
            {workout.exercises.length} ex{workout.exercises.length !== 1 ? '' : ''}
          </p>
        </div>
      </div>
    </motion.div>
  );
}