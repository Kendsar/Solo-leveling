import { TopCommandBar } from "../components/TopCommandBar";
import { CentralControlPanel } from "../components/CentralControlPanel";
import { WeeklyGrid } from "../components/WeeklyGrid";
import { HabitsPanel } from "../components/HabitsPanel";
import { processUserData, processSystemStats, processWeeklyData, processHabitsData } from "../utils/processHunterData";

export function Dashboard() {
  const userData = processUserData();
  const systemStats = processSystemStats();
  const weekData = processWeeklyData();
  const habitsData = processHabitsData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <TopCommandBar {...userData} />
      <CentralControlPanel {...systemStats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HabitsPanel habits={habitsData} />
      </div>
      <WeeklyGrid weekData={weekData} />
    </div>
  );
}
