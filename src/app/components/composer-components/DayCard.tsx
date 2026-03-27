import { useDrop } from 'react-dnd';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Button } from '../../components/ui/button';
import { Dumbbell, Moon, Lock } from 'lucide-react';
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

  const isActive = isOver && canDrop;

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.name || 'Unknown';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        ref={drop}
        className={`transition-all ${isActive
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : day.completed
            ? 'bg-green-50 border-green-300'
            : day.restDay
              ? 'bg-gray-50'
              : canDrop
                ? 'hover:border-gray-400'
                : ''
          }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{dayName}</h3>
              <p className="text-sm text-gray-500">{dateNum}</p>
            </div>
            {!day.restDay && (
              <div className="flex items-center gap-2">
                {day.completed && <Lock className="size-3 text-gray-400" />}
                <Checkbox
                  checked={day.completed}
                  onCheckedChange={() => onToggleComplete(dayIndex)}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {day.restDay ? (
            <div className="text-center py-8 space-y-2">
              <Moon className="size-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">Recharging energy…</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleRestDay(dayIndex)}
                className="text-xs"
              >
                Remove Rest Day
              </Button>
            </div>
          ) : day.workout ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Dumbbell className="size-4" />
                <span className="font-medium">{day.workout.name}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                {day.workout.exercises.slice(0, 3).map((ex) => (
                  <div key={ex.id}>• {getExerciseName(ex.exerciseId)}</div>
                ))}
                {day.workout.exercises.length > 3 && (
                  <div>+{day.workout.exercises.length - 3} more</div>
                )}
              </div>
              {!day.completed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleRestDay(dayIndex)}
                  className="text-xs w-full mt-2"
                >
                  Mark as Rest Day
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <div className="text-sm text-gray-400">Drop workout here</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleRestDay(dayIndex)}
              >
                <Moon className="size-3 mr-2" />
                Rest Day
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}