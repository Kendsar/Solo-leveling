import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Circle,
  Lock,
  CheckSquare,
  Square,
  Plus,
  X,
  Save,
  Pencil,
} from 'lucide-react';
import { DayData, ProcessedExercise } from './WeeklyGrid';
import MOCK from '../../imports/pasted_text/mock-data.json';

export function getWorkoutOptions(): string[] {
  return MOCK.workoutsOptions;
}

interface DayCardProps {
  dayData: DayData;
  delay?: number;
}

export function DayCard({ dayData, delay = 0 }: DayCardProps) {
  const {
    day,
    date,
    title,
    status,
    completionRate,
    exercises,
    isFuture,
    isToday,
    isDisabled,
  } = dayData;

  const [localTitle, setLocalTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [localExercises, setLocalExercises] =
    useState<ProcessedExercise[]>(exercises);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [isLbs, setIsLbs] = useState(false);

  const isRestDay = (): boolean => {
    return dayData.title.toLowerCase().includes('rest');
  };

  const message = isToday
    ? 'Recharge. You’ve earned it'
    : 'Recovery is part of your growth';

  const statusConfig = {
    completed: {
      borderColor: 'border-emerald-500/40',
      bgGradient: 'from-emerald-950/40 to-emerald-900/20',
      glowColor: 'from-emerald-500/20 to-emerald-600/20',
      icon: Check,
      iconColor: 'text-emerald-400',
      ringColor: '#10b981',
    },
    active: {
      borderColor: 'border-cyan-500/50',
      bgGradient: 'from-cyan-950/50 to-blue-950/30',
      glowColor: 'from-cyan-500/30 to-blue-600/30',
      icon: Circle,
      iconColor: 'text-cyan-400',
      ringColor: '#06b6d4',
    },
    upcoming: {
      borderColor: 'border-cyan-500/20',
      bgGradient: 'from-slate-950/40 to-slate-900/20',
      glowColor: 'from-cyan-500/10 to-blue-600/10',
      icon: Circle,
      iconColor: 'text-cyan-400/40',
      ringColor: '#06b6d4',
    },
    locked: {
      borderColor: 'border-slate-700/30',
      bgGradient: 'from-slate-950/30 to-slate-900/20',
      glowColor: 'from-slate-500/10 to-slate-600/10',
      icon: Lock,
      iconColor: 'text-slate-500',
      ringColor: '#475569',
    },
  };

  const config = statusConfig[status] || statusConfig.locked;
  const StatusIcon = config.icon;
  const isInteractive = !isDisabled;

  const handleSaveTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!newTaskName.trim()) return;

    let details = '';
    if (sets || reps) details = `(${sets || 0} sets - ${reps || 0} reps)`;
    if (weight) details += ` (${weight}${isLbs ? 'lbs' : 'Kg'})`;

    const newTask: ProcessedExercise = {
      name: newTaskName,
      completed: false,
      details: details.trim(),
    };
    setLocalExercises([...localExercises, newTask]);
    setIsAddingTask(false);
    setNewTaskName('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const toggleTaskCompletion = (idx: number) => {
    const updated = [...localExercises];
    updated[idx].completed = !updated[idx].completed;
    setLocalExercises(updated);
  };

  const saveEditTask = (idx: number) => {
    if (editingIndex === null) return;
    const updated = [...localExercises];
    updated[idx].name = editingValue;
    setLocalExercises(updated);
    setEditingIndex(null);
  };

  return (
    <motion.div
      className={`relative group ${isDisabled ? 'opacity-60 grayscale-[0.5]' : ''} flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={isInteractive && !isAddingTask ? { scale: 1.02 } : {}}
    >
      {isInteractive && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.glowColor} rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
      )}

      <div
        className={`relative border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm rounded-lg overflow-hidden flex flex-col h-full ${isInteractive ? 'cursor-default' : 'cursor-not-allowed'}`}
      >
        {/* Top accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${status === 'completed' ? 'emerald' : 'cyan'}-400/50 to-transparent`}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)',
            backgroundSize: '15px 15px',
          }}
        />

        <div className="relative p-5 flex flex-col h-full z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-cyan-100 tracking-wider font-normal">
                {day}
              </span>
              <span className="text-xs text-cyan-400/50 font-mono">{date}</span>
            </div>
            <div
              className={`p-1.5 rounded-md border ${config.borderColor} bg-gradient-to-br ${config.bgGradient}`}
            >
              <StatusIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
            </div>
          </div>

          {/* Title (editable if today) */}
          <div className="mb-4 flex items-center gap-2">
            {isEditingTitle ? (
              <select
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                className="flex-1 bg-slate-800 border border-cyan-500/30 text-cyan-100 text-sm p-1 rounded"
              >
                {getWorkoutOptions().map((w, i) => (
                  <option key={i} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <h3 className="flex items-center gap-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-cyan-400 flex-1">
                  {dayData.isFuture && (
                    <Pencil
                      className="w-4 h-4 text-cyan-400 cursor-pointer"
                      onClick={() => setIsEditingTitle(true)}
                    />
                  )}
                  {localTitle}
                </h3>
              </>
            )}
          </div>

          {/* Exercises */}
          <div className="flex flex-col gap-2 mb-6">
            {!isRestDay() ? (
              <div className="text-sm text-cyan-400/70 italic flex items-center gap-2">
                {localExercises.length === 0 ? (
                  <div className="text-xs text-cyan-400/40 italic flex-1 flex items-center justify-center py-4">
                    No tasks scheduled
                  </div>
                ) : (
                  localExercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-slate-950/40 p-2.5 rounded border border-cyan-500/10 hover:border-cyan-500/30 transition-colors cursor-pointer"
                    >
                      <div
                        className="mt-0.5"
                        onClick={() => toggleTaskCompletion(idx)}
                      >
                        {ex.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-cyan-400/40" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        {editingIndex === idx ? (
                          <input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() => saveEditTask(idx)}
                            autoFocus
                            className="text-sm bg-transparent border-b border-cyan-500 text-cyan-100 outline-none"
                          />
                        ) : (
                          <span
                            className={`${ex.completed ? 'line-through text-emerald-100/80' : 'text-cyan-50'} text-sm`}
                          >
                            {ex.name}
                          </span>
                        )}
                        {ex.details && (
                          <span className="text-[10px] text-cyan-400/60 font-mono mt-0.5">
                            {ex.details}
                          </span>
                        )}
                      </div>
                      {dayData.isFuture && editingIndex !== idx && (
                        <Pencil
                          className="w-3.5 h-3.5 text-cyan-400 cursor-pointer mt-0.5"
                          onClick={() => {
                            setEditingIndex(idx);
                            setEditingValue(ex.name);
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div
                style={{ margin: 'auto' }}
                className="text-sm text-cyan-400/70 italic"
              >
                {message}

                {dayData.isToday && (
                  <div className="mt-2 flex justify-center gap-2 relative z-10">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress */}
          {localExercises.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest">
                  Progress
                </span>
                <span className="text-xs font-mono flex items-center gap-1 text-cyan-300">
                  {completionRate}%{' '}
                  {completionRate === 100 && (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </span>
              </div>
              <div className="relative h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-cyan-500/20">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500/60 to-cyan-400/60`}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: delay + 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Add Task */}
          {isFuture && !isRestDay() ? (
            <div className="mt-2 text-sm">
              <AnimatePresence mode="popLayout">
                {isAddingTask ? (
                  <motion.div
                    className="bg-slate-950/80 rounded border border-cyan-500/30 p-3 flex flex-col gap-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-cyan-400/80 uppercase tracking-wider">
                        New Exercise
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAddingTask(false);
                        }}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Exercise"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-cyan-50 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                      autoFocus
                    />

                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Sets"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        className="w-1/3 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-[11px] text-cyan-50"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="w-1/3 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-[11px] text-cyan-50"
                      />
                      <input
                        type="number"
                        placeholder="Weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-1/3 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-[11px] text-cyan-50"
                      />
                      <button
                        onClick={() => setIsLbs(!isLbs)}
                        className="flex items-center bg-slate-900 border border-slate-700 rounded p-0.5 text-[9px] font-bold"
                      >
                        <span
                          className={
                            !isLbs
                              ? 'bg-cyan-500/20 text-cyan-300 px-1'
                              : 'text-slate-500 px-1'
                          }
                        >
                          kg
                        </span>
                        <span
                          className={
                            isLbs
                              ? 'bg-cyan-500/20 text-cyan-300 px-1'
                              : 'text-slate-500 px-1'
                          }
                        >
                          lbs
                        </span>
                      </button>
                    </div>

                    <button
                      className="w-full py-1.5 flex items-center justify-center gap-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-wider hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed group mt-1"
                      onClick={handleSaveTask}
                      disabled={!newTaskName.trim()}
                    >
                      <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{' '}
                      Save
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full py-2 flex items-center justify-center gap-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition-colors group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingTask(true);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{' '}
                    Add Task
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>

        {/* Corner accents */}
        {status === 'active' && (
          <>
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400" />
          </>
        )}
      </div>

      {/* Active pulse animation */}
      {status === 'active' && (
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400/30 rounded-lg pointer-events-none"
          animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}
