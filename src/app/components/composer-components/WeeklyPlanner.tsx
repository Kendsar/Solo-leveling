import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayCard } from './DayCard';
import { DraggableWorkout } from './DraggableWorkout';
import { useWorkout, Workout } from '../../context/WorkoutComposerContext';

export function WeeklyPlanner() {
  const { weeklyPlan, updateDayPlan, workouts } = useWorkout();

  const handleDrop = (workout: Workout, dayIndex: number) => {
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
        <div className="relative border border-cyan-500/20 bg-gradient-to-br from-slate-950/80 to-slate-900/80 backdrop-blur-xl rounded-xl p-6 overflow-hidden">
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400/70 uppercase tracking-widest">Weekly Planner</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent" />
          </div>

          <div className="space-y-6">
            {/* Available Workouts — drag source */}
            <div>
              <p className="text-[10px] text-cyan-400/50 uppercase tracking-widest mb-3">
                Available Workouts — Drag to Schedule
              </p>
              <div className="bg-slate-950/50 border border-cyan-500/10 rounded-lg p-3 min-h-[4rem]">
                {workouts.length === 0 ? (
                  <p className="text-xs text-cyan-400/30 text-center py-4 font-mono">
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

            {/* Week grid */}
            <div>
              <p className="text-[10px] text-cyan-400/50 uppercase tracking-widest mb-3">
                This Week
              </p>
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
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        </div>
      </motion.div>
    </DndProvider>
  );
}