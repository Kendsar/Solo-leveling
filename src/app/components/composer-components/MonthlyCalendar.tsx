import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Moon } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutComposerContext';

export function MonthlyCalendar() {
  const { getMonthlyData, currentMonth, setCurrentMonth } = useWorkout();

  const monthlyData = useMemo(() => getMonthlyData(), [currentMonth, getMonthlyData]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const getDayData = (day: number) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split('T')[0];
    return monthlyData.find((d) => d.date === dateStr);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative border border-cyan-500/20 bg-gradient-to-br from-slate-950/80 to-slate-900/80 backdrop-blur-xl rounded-xl p-6 overflow-hidden">
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400/70 uppercase tracking-widest">Monthly Overview</span>
            <div className="h-[1px] w-16 bg-gradient-to-r from-cyan-400/30 to-transparent" />
          </div>

          {/* Month navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-150"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-cyan-100 font-mono min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-150"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {/* Day labels */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] text-cyan-400/40 uppercase tracking-widest py-1.5 font-mono"
            >
              {day}
            </div>
          ))}

          {/* Empty leading cells */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayData = getDayData(day);
            const today = new Date();
            const isToday =
              today.getDate() === day &&
              today.getMonth() === currentMonth.getMonth() &&
              today.getFullYear() === currentMonth.getFullYear();

            const cellClass = [
              'border rounded-lg p-1.5 min-h-[64px] flex flex-col transition-colors duration-150',
              isToday
                ? 'border-cyan-500/50 bg-cyan-950/30'
                : dayData?.completed
                  ? 'border-emerald-500/25 bg-emerald-950/30'
                  : dayData?.restDay
                    ? 'border-slate-700/50 bg-slate-900/40'
                    : 'border-slate-800/50 bg-slate-950/40',
            ].join(' ');

            return (
              <div key={day} className={cellClass}>
                <div className={`text-[10px] font-mono mb-1 ${isToday ? 'text-cyan-300' : 'text-cyan-100/60'}`}>
                  {day}
                </div>
                {dayData && (
                  <div className="flex flex-col items-center justify-center flex-1 gap-0.5 text-[9px]">
                    {dayData.restDay ? (
                      <>
                        <Moon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-500">Rest</span>
                      </>
                    ) : dayData.workout ? (
                      <>
                        {dayData.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        <span className={`text-center line-clamp-2 ${dayData.completed ? 'text-emerald-400/70' : 'text-slate-500'}`}>
                          {dayData.workout.name}
                        </span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-cyan-400/40 pt-2 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400/60" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-slate-600" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Moon className="w-3 h-3 text-slate-500" />
            <span>Rest Day</span>
          </div>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      </div>
    </motion.div>
  );
}