import React, { useState } from 'react';
import { UserState, WorkoutRoutine } from '../types/workout';
import { GENERATE_PERSONALIZED_PLAN, PRESET_WORKOUTS } from '../data/workouts';
import {
  Calendar,
  Target,
  Sparkles,
  Award,
  ChevronRight,
  Check,
  Zap,
  Activity,
  Flame,
  ShieldCheck,
  RefreshCw,
  Play
} from 'lucide-react';

interface WorkoutPlansProps {
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectRoutine: (routine: WorkoutRoutine) => void;
}

export const WorkoutPlans: React.FC<WorkoutPlansProps> = ({
  userState,
  onUpdateUserState,
  onSelectRoutine
}) => {
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<'fat_loss' | 'strength' | 'endurance' | 'mobility' | 'general_fit'>(
    userState.profile.goal || 'general_fit'
  );
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    userState.profile.fitnessLevel || 'beginner'
  );
  const [lowImpact, setLowImpact] = useState<boolean>(
    userState.profile.isLowImpactOnly || false
  );
  const [activeWeek, setActiveWeek] = useState<number>(userState.planWeek || 1);

  // Generate current personalized plan
  const plan = GENERATE_PERSONALIZED_PLAN(selectedLevel, selectedGoal, lowImpact);
  const currentWeekDays = plan.schedule[activeWeek] || plan.schedule[1];

  // Today's day index (1 = Mon, 7 = Sun)
  const jsDay = new Date().getDay();
  const todayDayIndex = jsDay === 0 ? 7 : jsDay;

  const handleSavePlan = () => {
    const updatedState: UserState = {
      ...userState,
      profile: {
        ...userState.profile,
        goal: selectedGoal,
        fitnessLevel: selectedLevel,
        isLowImpactOnly: lowImpact
      },
      activePlanId: plan.id,
      planWeek: activeWeek
    };
    onUpdateUserState(updatedState);
    setIsCustomizing(false);
  };

  const handleStartPlanDay = (workoutId: string) => {
    const routine = PRESET_WORKOUTS.find((r) => r.id === workoutId) || PRESET_WORKOUTS[0];
    onSelectRoutine(routine);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black app-text tracking-tight">
            Personalized Plans
          </h1>
          <p className="text-xs app-text-sub mt-1">
            Goal-oriented 4-week scientific interval training schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="px-3 py-1.5 rounded-xl app-card-subtle hover:app-card-hover text-xs font-bold text-rose-700 dark:text-rose-300 border app-border transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw size={13} />
          {isCustomizing ? 'Close Wizard' : 'Change Goal'}
        </button>
      </div>

      {/* Plan Customizer Wizard */}
      {isCustomizing && (
        <div className="app-card border border-rose-500/30 rounded-3xl p-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 text-sm font-black app-text">
            <Sparkles size={18} className="text-rose-700 dark:text-rose-400" />
            Customize Your Fitness Blueprint
          </div>

          {/* Goal Selector */}
          <div>
            <label className="text-xs font-bold uppercase app-text-sub block mb-2">
              1. What is your primary fitness goal?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'fat_loss', label: 'Fat Loss & HIIT', icon: '🔥' },
                { id: 'strength', label: 'Body Strength', icon: '💪' },
                { id: 'endurance', label: 'Cardio Stamina', icon: '⚡' },
                { id: 'general_fit', label: 'Daily Habit', icon: '🏆' },
                { id: 'mobility', label: 'Joint Mobility', icon: '🧘' }
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGoal(g.id as any)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    selectedGoal === g.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-200 font-bold'
                      : 'app-card-subtle app-border app-text-sub hover:app-text hover:app-card-hover'
                  }`}
                >
                  <span className="text-lg">{g.icon}</span>
                  <span className="text-xs">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fitness Level */}
          <div>
            <label className="text-xs font-bold uppercase app-text-sub block mb-2">
              2. Your Fitness Experience Level:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                    selectedLevel === lvl
                      ? 'bg-sky-500/20 border-sky-400 text-sky-700 dark:text-sky-300 font-bold'
                      : 'app-card-subtle app-border app-text-sub hover:app-text hover:app-card-hover'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Low impact checkbox */}
          <div className="flex items-center justify-between p-3 rounded-xl app-card-subtle border app-border">
            <div>
              <div className="text-xs font-bold app-text">
                Joint-Safe & Low Impact Mode
              </div>
              <div className="text-[11px] app-text-sub">
                Eliminates jumping exercises to protect knees and ankles.
              </div>
            </div>
            <input
              type="checkbox"
              checked={lowImpact}
              onChange={(e) => setLowImpact(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleSavePlan}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all"
          >
            Apply Personalized Program
          </button>
        </div>
      )}

      {/* Active Plan Overview Card */}
      <div className="app-card border app-border rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40">
                Week {activeWeek} of 4
              </span>
              <span className="text-[11px] font-bold app-text-sub capitalize">
                {selectedLevel} Level
              </span>
            </div>
            <h2 className="text-xl font-black app-text">{plan.title}</h2>
            <p className="text-xs app-text-sub mt-1">{plan.description}</p>
          </div>
        </div>

        {/* Week Selector Tabs */}
        <div className="flex gap-2 mt-4 pt-3 border-t app-border overflow-x-auto no-scrollbar">
          {[1, 2, 3, 4].map((wk) => (
            <button
              key={wk}
              type="button"
              onClick={() => setActiveWeek(wk)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeWeek === wk
                  ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                  : 'app-card-subtle app-text-sub hover:app-text hover:app-card-hover'
              }`}
            >
              Week {wk}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Recommended Highlight */}
      {(() => {
        const todaySchedule = currentWeekDays.find((d) => d.dayIndex === todayDayIndex);
        if (!todaySchedule) return null;
        const routineMatch = PRESET_WORKOUTS.find((r) => r.id === todaySchedule.workoutId);

        return (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Today's Assignment ({todaySchedule.dayName})
              </span>
              <div className="text-base font-black app-text">
                {todaySchedule.isRest ? 'Active Recovery Day' : routineMatch?.title || todaySchedule.focus}
              </div>
              <div className="text-xs app-text-sub">
                Focus: {todaySchedule.focus}
              </div>
            </div>

            {!todaySchedule.isRest && routineMatch && (
              <button
                type="button"
                onClick={() => handleStartPlanDay(todaySchedule.workoutId)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-rose-400 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Play size={14} className="fill-white" />
                Start Today
              </button>
            )}
          </div>
        );
      })()}

      {/* Weekly Schedule Days */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase app-text-sub flex items-center gap-1.5">
          <Calendar size={14} className="text-sky-600 dark:text-sky-400" /> Week {activeWeek} Schedule:
        </div>

        {currentWeekDays.map((day) => {
          const isToday = day.dayIndex === todayDayIndex;
          const workout = PRESET_WORKOUTS.find((w) => w.id === day.workoutId);

          return (
            <div
              key={day.dayIndex}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                isToday
                  ? 'app-card border-rose-500/60 shadow-md ring-1 ring-rose-500/40'
                  : 'app-card-subtle app-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                    day.isRest
                      ? 'app-card app-text-sub'
                      : isToday
                      ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                      : 'app-card text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {day.dayName.substring(0, 3)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold app-text">
                      {day.isRest ? 'Rest & Recharge' : workout?.title || day.focus}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-black uppercase bg-rose-600 dark:bg-rose-500 text-white px-1.5 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-xs app-text-sub">
                    {day.focus} {workout ? '· 7 Minutes' : ''}
                  </div>
                </div>
              </div>

              {!day.isRest && workout && (
                <button
                  type="button"
                  onClick={() => handleStartPlanDay(day.workoutId)}
                  className="p-2 rounded-xl app-card hover:app-card-hover text-rose-700 dark:text-rose-400 hover:app-text transition-colors border app-border"
                  title="View / Start Workout"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
