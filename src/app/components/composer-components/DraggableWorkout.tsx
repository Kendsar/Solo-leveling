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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.95 : 1
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="border rounded-lg p-3 cursor-move bg-white hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2">
        <Dumbbell className="size-4 text-gray-600" />
        <div>
          <h4 className="font-medium text-sm">{workout.name}</h4>
          <p className="text-xs text-gray-500">
            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </motion.div>
  );
}