import React from 'react';
import { UserState, WorkoutLog, Achievement } from '../types/workout';
import {
  Heart,
  Flame,
  Clock,
  Award,
  Calendar,
  Activity,
  Zap,
  TrendingUp,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface StatsAndBadgesProps {
  userState: UserState;
  workoutLogs: WorkoutLog[];
  achievements: Achievement[];
}

export const StatsAndBadges: React.FC<StatsAndBadgesProps> = ({
  userState,
  workoutLogs,
  achievements
}) => {
  const totalHours = (userState.totalMinutesSweated / 60).toFixed(1);
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  // Build 30-day activity map
  const last30Days: { dateStr: string; label: string; count: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const logCount = workoutLogs.filter((l) => l.date === dateStr).length;
    last30Days.push({
      dateStr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: logCount
    });
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black app-text tracking-tight">
          Progress & Motivation
        </h1>
        <p className="text-xs app-text-sub mt-1">
          Daily streak discipline, Seven 3-hearts system, and unlocked achievements.
        </p>
      </div>

      {/* Seven 3-Hearts Motivation Card */}
      <div className="app-card border border-rose-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Seven Life Protection
            </div>
            <h2 className="text-xl font-black app-text mt-0.5">
              {userState.hearts} Hearts Remaining
            </h2>
          </div>

          {/* 3 Hearts Visual */}
          <div className="flex items-center gap-1.5 app-card-subtle px-3 py-2 rounded-2xl border app-border">
            {[1, 2, 3].map((hIdx) => (
              <Heart
                key={hIdx}
                size={26}
                className={`${
                  hIdx <= userState.hearts
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-300 dark:text-slate-700 fill-slate-200 dark:fill-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-xs app-text-sub mt-3 leading-relaxed">
          {userState.hearts === 3
            ? '🔥 Perfect condition! Complete your 7-minute workout today to maintain your invincible streak.'
            : '⚠️ You have lost hearts due to missed days. Complete consecutive daily workouts to restore your hearts!'}
        </p>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="app-card border app-border rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between app-text-sub mb-1">
            <span className="text-xs font-bold uppercase">Current Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono app-text">
            {userState.currentStreak} <span className="text-xs app-text-sub font-sans font-bold">days</span>
          </div>
          <div className="text-[10px] app-text-sub mt-1">
            Best: {userState.longestStreak} days
          </div>
        </div>

        <div className="app-card border app-border rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between app-text-sub mb-1">
            <span className="text-xs font-bold uppercase">Workouts</span>
            <Activity size={16} className="text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono app-text">
            {userState.totalWorkoutsCompleted}
          </div>
          <div className="text-[10px] app-text-sub mt-1">
            Sessions finished
          </div>
        </div>

        <div className="app-card border app-border rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between app-text-sub mb-1">
            <span className="text-xs font-bold uppercase">Total Sweat</span>
            <Clock size={16} className="text-sky-500" />
          </div>
          <div className="text-2xl font-black font-mono app-text">
            {userState.totalMinutesSweated} <span className="text-xs app-text-sub font-sans font-bold">min</span>
          </div>
          <div className="text-[10px] app-text-sub mt-1">
            ~{totalHours} hours total
          </div>
        </div>

        <div className="app-card border app-border rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between app-text-sub mb-1">
            <span className="text-xs font-bold uppercase">Calories</span>
            <Zap size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono app-text">
            {userState.totalCaloriesBurned}
          </div>
          <div className="text-[10px] app-text-sub mt-1">
            Est. energy burned
          </div>
        </div>
      </div>

      {/* 30-Day Activity Heatmap */}
      <div className="app-card border app-border rounded-3xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-rose-500" />
            <span className="text-xs font-bold uppercase app-text">
              30-Day Consistency Heatmap
            </span>
          </div>
          <span className="text-xs app-text-sub">
            {workoutLogs.length} logged
          </span>
        </div>

        {/* Heatmap 30 squares grid */}
        <div className="grid grid-cols-10 gap-1.5 pt-1">
          {last30Days.map((item, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-mono transition-all ${
                item.count >= 2
                  ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/50'
                  : item.count === 1
                  ? 'bg-rose-500/60 text-white font-semibold'
                  : 'app-card-subtle app-text-muted border app-border'
              }`}
              title={`${item.label}: ${item.count} workouts`}
            >
              {idx === 29 ? 'Today' : ''}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] app-text-sub pt-1">
          <span>30 days ago</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded app-card-subtle border app-border inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-rose-500/60 inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Achievements Badges Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <h2 className="text-base font-black app-text">
              Achievement Badges ({unlockedCount}/{achievements.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            const pct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 shadow-sm ${
                  isUnlocked
                    ? 'app-card border-amber-500/40'
                    : 'app-card-subtle app-border opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-500/20 border border-amber-500/50 shadow-md'
                      : 'app-card-subtle border app-border'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock size={18} className="app-text-muted" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold app-text truncate">
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <p className="text-xs app-text-sub mt-0.5">{ach.description}</p>

                  {/* Progress Bar */}
                  {!isUnlocked && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] app-text-sub">
                        <span>Progress</span>
                        <span>
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full app-card-subtle border app-border overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Workout Activity Logs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black app-text">Recent Activity History</h2>
          <span className="text-xs app-text-sub">{workoutLogs.length} total entries</span>
        </div>

        {workoutLogs.length === 0 ? (
          <div className="app-card border app-border rounded-2xl p-6 text-center text-xs app-text-sub">
            No workouts logged yet. Complete your first 7-minute circuit today!
          </div>
        ) : (
          <div className="space-y-2">
            {workoutLogs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="app-card border app-border rounded-xl p-3 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                    <Flame size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold app-text">{log.workoutTitle}</div>
                    <div className="text-xs app-text-sub">
                      {new Date(log.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold app-text">
                    {Math.round(log.durationSeconds / 60)} min
                  </div>
                  <div className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                    {log.caloriesBurned} kcal
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
