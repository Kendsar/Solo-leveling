# Hunter System Data

This directory contains the JSON data that powers the Hunter System dashboard.

## File: user-data.json

This file contains all the dynamic data displayed in the dashboard, including:

- **User Profile**: Name, level, XP, titles, streak
- **Goals**: Active goals with progress tracking
- **Achievements**: Unlocked and locked achievements
- **Daily Tasks**: Weekly task breakdown with completion status
- **Daily Habits**: Recurring habits with completion tracking
- **Weekly Summary**: Aggregated statistics for the current week

## How to Update Data

To update the dashboard with new information, simply modify the values in `user-data.json`. The dashboard will automatically reflect the changes.

### Key Fields to Update Regularly:

1. **user.experience** - Current XP amount
2. **user.streak** - Current consecutive days streak
3. **user.xpGainedToday** - XP earned today (affects energy level)
4. **dailyTasks[].tasks[].completed** - Mark tasks as done
5. **dailyTasks[].done** - Mark entire day as complete
6. **dailyTasks[].doughnutProgress** - Update daily completion percentage
7. **weeklySummary** - Update weekly aggregated stats

### Data Validation:

- Dates in `dailyTasks` should be in ISO format: "YYYY-MM-DD"
- Progress percentages should be between 0-100
- XP values should be positive numbers
- The `done` field in dailyTasks should match the completion of all tasks

## Data Flow:

```
user-data.json → processHunterData.ts → Dashboard Components
```

The data processing utilities in `/src/app/utils/processHunterData.ts` transform the raw JSON into the format needed by each component.
