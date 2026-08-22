import React, { useState, useEffect } from 'react';
import {
  UserState,
  WorkoutRoutine,
  CoachPersonality,
  WorkoutLog,
  Achievement
} from './types/workout';
import { PRESET_WORKOUTS } from './data/workouts';
import { COACHES } from './data/coaches';
import {
  getStoredUserState,
  saveUserState,
  getStoredWorkoutLogs,
  getStoredAchievements,
  saveWorkoutLogs,
  saveAchievements
} from './services/storage';
import { ActiveWorkout } from './components/ActiveWorkout';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { WorkoutPlans } from './components/WorkoutPlans';
import { CustomWorkoutBuilder } from './components/CustomWorkoutBuilder';
import { StatsAndBadges } from './components/StatsAndBadges';
import { SettingsModal } from './components/SettingsModal';
import { TestingGuideModal } from './components/TestingGuideModal';
import {
  Flame,
  Heart,
  Play,
  Dumbbell,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Settings,
  Shield,
  Clock,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'workouts' | 'plans' | 'exercises' | 'custom' | 'stats'>('workouts');

  // Application Data States
  const [userState, setUserState] = useState<UserState>(getStoredUserState());
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(getStoredWorkoutLogs());
  const [achievements, setAchievements] = useState<Achievement[]>(getStoredAchievements());

  // Modal & Flow States
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<WorkoutRoutine | null>(null);
  const [selectedRoutineForModal, setSelectedRoutineForModal] = useState<WorkoutRoutine | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTestingGuide, setShowTestingGuide] = useState<boolean>(false);

  // Sync state changes to storage
  const handleUpdateUserState = (updated: UserState) => {
    setUserState(updated);
    saveUserState(updated);
  };

  // Routine selection
  const handleOpenDetailModal = (routine: WorkoutRoutine) => {
    setSelectedRoutineForModal(routine);
  };

  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setSelectedRoutineForModal(null);
    setActiveWorkoutRoutine(routine);
  };

  const handleFinishWorkout = () => {
    setActiveWorkoutRoutine(null);
    // Reload fresh data from storage
    setUserState(getStoredUserState());
    setWorkoutLogs(getStoredWorkoutLogs());
    setAchievements(getStoredAchievements());
  };

  const handleSaveCustomWorkout = (newRoutine: WorkoutRoutine) => {
    const updatedCustoms = [...userState.customWorkouts, newRoutine];
    const updatedState = { ...userState, customWorkouts: updatedCustoms };
    handleUpdateUserState(updatedState);
  };

  const handleDeleteCustomWorkout = (id: string) => {
    const updatedCustoms = userState.customWorkouts.filter((r) => r.id !== id);
    const updatedState = { ...userState, customWorkouts: updatedCustoms };
    handleUpdateUserState(updatedState);
  };

  // Apply theme class to document & body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-oled', 'dark', 'light', 'oled');
    root.setAttribute('data-theme', userState.theme);
    root.classList.add(`theme-${userState.theme}`);
    if (userState.theme === 'dark' || userState.theme === 'oled') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [userState.theme]);

  // Featured Daily Workout
  const featuredWorkout = PRESET_WORKOUTS[0]; // Classic 7M

  return (
    <div
      data-theme={userState.theme}
      className="min-h-screen app-bg app-text flex flex-col font-sans selection:bg-rose-500 selection:text-white transition-colors duration-200"
    >
      {/* Top Mobile App Bar */}
      <header className="sticky top-0 z-30 app-header backdrop-blur-md border-b app-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md shadow-rose-600/30 font-black text-white text-base">
              7
            </div>
            <div>
              <div className="text-sm font-black tracking-tight app-text leading-none">
                SevenFit
              </div>
              <div className="text-[10px] app-text-sub font-semibold tracking-wider uppercase">
                7-Minute Scientific Intervals
              </div>
            </div>
          </div>

          {/* Gamification Badges: Streak & Hearts */}
          <div className="flex items-center gap-2">
            {/* 3 Hearts Indicator */}
            <div
              className="flex items-center gap-1 app-card border app-border px-2.5 py-1 rounded-full cursor-pointer hover:border-rose-500/40 transition-colors shadow-sm"
              onClick={() => setActiveTab('stats')}
              title="Seven Hearts Life"
            >
              {[1, 2, 3].map((hIdx) => (
                <Heart
                  key={hIdx}
                  size={14}
                  className={`${
                    hIdx <= userState.hearts
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-slate-400 dark:text-slate-700 fill-slate-300 dark:fill-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 app-card border app-border px-2.5 py-1 rounded-full cursor-pointer hover:border-amber-500/40 transition-colors shadow-sm"
              onClick={() => setActiveTab('stats')}
              title="Current Streak"
            >
              <Flame size={14} className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
              <span className="text-xs font-black text-amber-500 dark:text-amber-400 font-mono">
                {userState.currentStreak}
              </span>
            </div>

            {/* Settings Gear */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full app-text-sub hover:app-text app-card-hover transition-colors"
              aria-label="Open settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-4">
        {activeTab === 'workouts' && (
          <div className="space-y-6 pb-24">
            {/* Daily Motivation Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-600 p-6 text-white shadow-2xl shadow-rose-950/20">
              <div className="relative z-10 max-w-md space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-sm text-[11px] font-black uppercase tracking-wider text-rose-100">
                  <Zap size={13} className="text-amber-300 fill-amber-300" />
                  Today's Scientific Challenge
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  7 Minutes to Peak Physical Fitness
                </h1>
                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                  High-intensity circuit training scientifically proven to boost metabolic rate, VO2 max, and strength with 0 equipment.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenDetailModal(featuredWorkout)}
                    className="px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Play size={16} className="fill-slate-950 text-slate-950" />
                    Start Classic 7M
                  </button>

                  <div className="text-xs font-semibold text-rose-100 flex items-center gap-1">
                    <Clock size={14} /> 7 min · 12 drills
                  </div>
                </div>
              </div>

              {/* Background decorative athlete silhouette glow */}
              <div className="absolute -right-6 -bottom-8 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Coach Quick Bar */}
            <div className="app-card border app-border rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {COACHES[userState.selectedCoachId]?.avatarEmoji}
                </span>
                <div>
                  <div className="text-xs font-bold app-text flex items-center gap-1.5">
                    Coach {COACHES[userState.selectedCoachId]?.name}
                    <span className="text-[10px] app-text-sub font-normal">Active</span>
                  </div>
                  <div className="text-[11px] app-text-sub italic">
                    "{COACHES[userState.selectedCoachId]?.phrases.start[0]}"
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="text-xs font-bold text-rose-500 dark:text-rose-400 hover:opacity-80 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 transition-colors"
              >
                Change Coach
              </button>
            </div>

            {/* Workout Presets Catalog */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black app-text">Targeted Workout Circuits</h2>
                <span className="text-xs app-text-sub">{PRESET_WORKOUTS.length} routines</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PRESET_WORKOUTS.map((routine) => {
                  return (
                    <div
                      key={routine.id}
                      onClick={() => handleOpenDetailModal(routine)}
                      className="app-card border app-border hover:border-rose-500/40 rounded-2xl p-4 transition-all hover:shadow-xl cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                            {routine.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono app-text-sub font-semibold">
                            ~7 min
                          </span>
                        </div>

                        <h3 className="text-base font-bold app-text group-hover:text-rose-500 transition-colors">
                          {routine.title}
                        </h3>
                        <p className="text-xs app-text-sub mt-1 line-clamp-2">
                          {routine.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-2 border-t app-border">
                        <span className="text-xs app-text-sub font-medium">
                          {routine.exercises.length} exercises
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-rose-500 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
                          <span>View & Start</span>
                          <ChevronRight size={15} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <WorkoutPlans
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
            onSelectRoutine={handleOpenDetailModal}
          />
        )}

        {activeTab === 'exercises' && <ExerciseLibrary />}

        {activeTab === 'custom' && (
          <CustomWorkoutBuilder
            customWorkouts={userState.customWorkouts}
            onSaveCustomWorkout={handleSaveCustomWorkout}
            onDeleteCustomWorkout={handleDeleteCustomWorkout}
            onSelectRoutine={handleOpenDetailModal}
          />
        )}

        {activeTab === 'stats' && (
          <StatsAndBadges
            userState={userState}
            workoutLogs={workoutLogs}
            achievements={achievements}
          />
        )}
      </main>

      {/* Bottom Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 app-nav backdrop-blur-md border-t app-border px-2 py-1.5">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: 'workouts', label: 'Workouts', icon: Dumbbell },
            { id: 'plans', label: 'Plans', icon: Calendar },
            { id: 'exercises', label: 'Exercises', icon: Layers },
            { id: 'custom', label: 'Custom', icon: Sparkles },
            { id: 'stats', label: 'Progress', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-rose-500 font-bold scale-105'
                    : 'app-text-sub hover:app-text'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Active Workout Screen Modal */}
      {activeWorkoutRoutine && (
        <ActiveWorkout
          routine={activeWorkoutRoutine}
          selectedCoachId={userState.selectedCoachId}
          onFinish={handleFinishWorkout}
          onExit={() => setActiveWorkoutRoutine(null)}
        />
      )}

      {/* Workout Detail & Start Modal */}
      {selectedRoutineForModal && (
        <WorkoutDetailModal
          routine={selectedRoutineForModal}
          selectedCoachId={userState.selectedCoachId}
          onSelectCoach={(coachId) => {
            handleUpdateUserState({ ...userState, selectedCoachId: coachId });
          }}
          onStart={handleStartWorkout}
          onClose={() => setSelectedRoutineForModal(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          userState={userState}
          onUpdateUserState={handleUpdateUserState}
          onClose={() => setShowSettings(false)}
          onOpenTestingGuide={() => {
            setShowSettings(false);
            setShowTestingGuide(true);
          }}
        />
      )}

      {/* Mobile Testing & F-Droid Guide Modal */}
      {showTestingGuide && (
        <TestingGuideModal onClose={() => setShowTestingGuide(false)} />
      )}
    </div>
  );
}
