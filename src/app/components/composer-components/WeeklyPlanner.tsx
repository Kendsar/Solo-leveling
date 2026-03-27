import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayCard } from './DayCard';
import { DraggableWorkout } from './DraggableWorkout';
import { useWorkout, Workout } from '../../context/WorkoutComposerContext';

export function WeeklyPlanner() {
  const { weeklyPlan, updateDayPlan, workouts } = useWorkout();

  const handleDrop = (workout: Workout, dayIndex: number) => {
    // Create a deep copy of the workout (snapshot)
    const workoutCopy: Workout = JSON.parse(JSON.stringify(workout));
    updateDayPlan(dayIndex, { workout: workoutCopy, restDay: false });
  };

  const handleToggleComplete = (dayIndex: number) => {
    const currentDay = weeklyPlan[dayIndex];
    updateDayPlan(dayIndex, { completed: !currentDay.completed });
  };

  const handleToggleRestDay = (dayIndex: number) => {
    const currentDay = weeklyPlan[dayIndex];
    updateDayPlan(dayIndex, {
      restDay: !currentDay.restDay,
      workout: currentDay.restDay ? currentDay.workout : null,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="size-5" />
              Weekly Planner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-3">
                Available Workouts (Drag to Schedule)
              </h3>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                {workouts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Create workouts above to schedule them
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {workouts.map((workout) => (
                      <DraggableWorkout key={workout.id} workout={workout} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-3">This Week</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {weeklyPlan.map((day, index) => (
                  <DayCard
                    key={day.date}
                    day={day}
                    dayIndex={index}
                    onDrop={handleDrop}
                    onToggleComplete={handleToggleComplete}
                    onToggleRestDay={handleToggleRestDay}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DndProvider>
  );
}