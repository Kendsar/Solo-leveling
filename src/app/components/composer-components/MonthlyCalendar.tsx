import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from '../../components/ui/button';
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="size-5" />
              Monthly Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <span className="font-semibold text-sm min-w-[140px] text-center">
                {monthName}
              </span>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-sm text-gray-600 py-2"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayData = getDayData(day);
              const today = new Date();
              const isToday =
                today.getDate() === day &&
                today.getMonth() === currentMonth.getMonth() &&
                today.getFullYear() === currentMonth.getFullYear();

              return (
                <div
                  key={day}
                  className={`border rounded-lg p-2 min-h-[80px] ${isToday ? 'border-blue-500 bg-blue-50' : ''
                    } ${dayData?.completed
                      ? 'bg-green-50 border-green-300'
                      : dayData?.restDay
                        ? 'bg-gray-50'
                        : ''
                    }`}
                >
                  <div className="text-sm font-semibold mb-1">{day}</div>
                  {dayData && (
                    <div className="flex flex-col items-center justify-center gap-1 text-xs">
                      {dayData.restDay ? (
                        <>
                          <Moon className="size-5 text-gray-400" />
                          <span className="text-gray-600">Rest</span>
                        </>
                      ) : dayData.workout ? (
                        <>
                          {dayData.completed ? (
                            <CheckCircle2 className="size-5 text-green-600" />
                          ) : (
                            <XCircle className="size-5 text-gray-400" />
                          )}
                          <span className="text-center line-clamp-2">
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

          <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="size-4 text-green-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="size-4 text-gray-400" />
              <span>Not Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Moon className="size-4 text-gray-400" />
              <span>Rest Day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}