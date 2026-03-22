import { TopCommandBar } from "../components/TopCommandBar";
import { CentralControlPanel } from "../components/CentralControlPanel";
import { WeeklyGrid } from "../components/WeeklyGrid";
import { HabitsPanel } from "../components/HabitsPanel";
import { processUserData, processSystemStats, getTodayWorkout, processHabitsData, mapWorkoutToDayData } from "../utils/processHunterData";

export function Dashboard() {
  const userData = processUserData();
  const systemStats = processSystemStats();
  const todayWorkoutRaw = getTodayWorkout();
  const todayWorkout = mapWorkoutToDayData(todayWorkoutRaw);
  const habitsData = processHabitsData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <TopCommandBar {...userData} />
      <WeeklyGrid weekData={todayWorkout} />
      <CentralControlPanel {...systemStats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HabitsPanel habits={habitsData} />
      </div>
    </div>
  );
}
