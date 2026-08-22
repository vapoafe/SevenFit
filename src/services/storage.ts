import { UserState, WorkoutLog, Achievement, WorkoutRoutine } from '../types/workout';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { PRESET_WORKOUTS } from '../data/workouts';

const STORAGE_KEYS = {
  USER_STATE: 'seven_app_user_state_v1',
  WORKOUT_LOGS: 'seven_app_workout_logs_v1',
  ACHIEVEMENTS: 'seven_app_achievements_v1',
  CUSTOM_WORKOUTS: 'seven_app_custom_workouts_v1',
};

const DEFAULT_USER_STATE: UserState = {
  hearts: 3,
  lastWorkoutDate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalWorkoutsCompleted: 0,
  totalMinutesSweated: 0,
  totalCaloriesBurned: 0,
  profile: {
    name: 'Athlete',
    fitnessLevel: 'beginner',
    goal: 'general_fit',
    weeklyGoalDays: 5,
    isLowImpactOnly: false,
    joinedDate: new Date().toISOString().split('T')[0]
  },
  selectedCoachId: 'drill',
  activePlanId: null,
  planWeek: 1,
  theme: 'dark',
  voiceVolume: 0.9,
  sfxVolume: 0.8,
  speechEnabled: true,
  sfxEnabled: true,
  hapticEnabled: true,
  keepScreenAwake: true,
  unlockedAchievements: [],
  customWorkouts: []
};

export const getStoredUserState = (): UserState => {
  if (typeof window === 'undefined') return DEFAULT_USER_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATE);
    if (!raw) return DEFAULT_USER_STATE;
    const parsed = JSON.parse(raw);

    // Run heart decay logic on load
    return updateHeartsAndStreakDecay(parsed);
  } catch (e) {
    console.error('Failed reading user state', e);
    return DEFAULT_USER_STATE;
  }
};

export const saveUserState = (state: UserState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATE, JSON.stringify(state));
  } catch (e) {
    console.error('Failed saving user state', e);
  }
};

export const getStoredWorkoutLogs = (): WorkoutLog[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveWorkoutLogs = (logs: WorkoutLog[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed saving workout logs', e);
  }
};

export const getStoredAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    const saved: Achievement[] = JSON.parse(raw);

    // Merge with any new initial definitions in case new ones were added
    return INITIAL_ACHIEVEMENTS.map(initial => {
      const match = saved.find(s => s.id === initial.id);
      return match ? { ...initial, ...match } : initial;
    });
  } catch (e) {
    return INITIAL_ACHIEVEMENTS;
  }
};

export const saveAchievements = (achievements: Achievement[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed saving achievements', e);
  }
};

// Check date diffs for 3-heart system
function getDayDiff(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function updateHeartsAndStreakDecay(state: UserState): UserState {
  if (!state.lastWorkoutDate) return state;

  const today = getTodayString();
  const dayDiff = getDayDiff(state.lastWorkoutDate, today);

  if (dayDiff > 1) {
    // Missed days!
    const missedDays = dayDiff - 1;
    let newHearts = state.hearts - missedDays;
    let newStreak = state.currentStreak;

    if (newHearts <= 0) {
      newHearts = 3; // Reset hearts once fully drained
      newStreak = 0; // Reset streak
    }

    const updated = {
      ...state,
      hearts: Math.max(1, newHearts),
      currentStreak: newHearts <= 0 ? 0 : newStreak
    };
    saveUserState(updated);
    return updated;
  }

  return state;
}

export const recordCompletedWorkout = (
  routine: WorkoutRoutine,
  durationSec: number,
  calories: number,
  coachId: string
): { updatedState: UserState; newlyUnlocked: Achievement[] } => {
  const today = getTodayString();
  const currentState = getStoredUserState();
  const currentLogs = getStoredWorkoutLogs();
  const currentAchievements = getStoredAchievements();

  // Streak & Heart calculation
  let newStreak = currentState.currentStreak;
  let newHearts = currentState.hearts;

  if (!currentState.lastWorkoutDate) {
    newStreak = 1;
  } else {
    const dayDiff = getDayDiff(currentState.lastWorkoutDate, today);
    if (dayDiff === 0) {
      // Worked out already today, maintain streak
      newStreak = currentState.currentStreak;
    } else if (dayDiff === 1) {
      // Worked out consecutive day!
      newStreak = currentState.currentStreak + 1;
      // Regain 1 heart on consecutive streak day up to max 3
      newHearts = Math.min(3, newHearts + 1);
    } else {
      // Missed days
      newStreak = 1;
      newHearts = 3;
    }
  }

  const durationMin = Math.round(durationSec / 60);

  const newLog: WorkoutLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    workoutId: routine.id,
    workoutTitle: routine.title,
    date: today,
    timestamp: Date.now(),
    durationSeconds: durationSec,
    caloriesBurned: calories,
    completedExercisesCount: routine.exercises.length,
    totalExercisesCount: routine.exercises.length,
    coachUsedId: coachId,
    completedFull: true
  };

  const updatedLogs = [newLog, ...currentLogs];
  saveWorkoutLogs(updatedLogs);

  const updatedState: UserState = {
    ...currentState,
    lastWorkoutDate: today,
    currentStreak: newStreak,
    longestStreak: Math.max(currentState.longestStreak, newStreak),
    totalWorkoutsCompleted: currentState.totalWorkoutsCompleted + 1,
    totalMinutesSweated: currentState.totalMinutesSweated + durationMin,
    totalCaloriesBurned: currentState.totalCaloriesBurned + calories,
    hearts: newHearts
  };

  // Evaluate Achievements
  const nowHour = new Date().getHours();
  const dayOfWeek = new Date().getDay(); // 0 = Sun, 6 = Sat
  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = currentAchievements.map(ach => {
    if (ach.unlockedAt) return ach; // already unlocked

    let newProgress = ach.progress;
    let unlocked = false;

    switch (ach.id) {
      case 'first_sweat':
        newProgress = 1;
        unlocked = true;
        break;
      case 'streak_3':
        newProgress = newStreak;
        if (newStreak >= 3) unlocked = true;
        break;
      case 'streak_7':
        newProgress = newStreak;
        if (newStreak >= 7) unlocked = true;
        break;
      case 'streak_30':
        newProgress = newStreak;
        if (newStreak >= 30) unlocked = true;
        break;
      case 'workouts_10':
        newProgress = updatedState.totalWorkoutsCompleted;
        if (newProgress >= 10) unlocked = true;
        break;
      case 'workouts_50':
        newProgress = updatedState.totalWorkoutsCompleted;
        if (newProgress >= 50) unlocked = true;
        break;
      case 'sweat_60m':
        newProgress = updatedState.totalMinutesSweated;
        if (newProgress >= 60) unlocked = true;
        break;
      case 'early_bird':
        if (nowHour < 8) {
          newProgress = 1;
          unlocked = true;
        }
        break;
      case 'night_owl':
        if (nowHour >= 21) {
          newProgress = 1;
          unlocked = true;
        }
        break;
      case 'core_specialist':
        if (routine.category === 'core' || routine.id.includes('core')) {
          newProgress = ach.progress + 1;
          if (newProgress >= 5) unlocked = true;
        }
        break;
      case 'hiit_master':
        if (routine.id === 'fat_torch_hiit' || routine.category === 'cardio') {
          newProgress = ach.progress + 1;
          if (newProgress >= 5) unlocked = true;
        }
        break;
      case 'weekend_warrior':
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          newProgress = ach.progress + 1;
          if (newProgress >= 2) unlocked = true;
        }
        break;
      default:
        break;
    }

    if (unlocked && !ach.unlockedAt) {
      const unlockedAch = {
        ...ach,
        progress: ach.maxProgress,
        unlockedAt: Date.now()
      };
      newlyUnlocked.push(unlockedAch);
      return unlockedAch;
    }

    return { ...ach, progress: Math.min(ach.maxProgress, newProgress) };
  });

  saveAchievements(updatedAchievements);
  saveUserState(updatedState);

  return { updatedState, newlyUnlocked };
};

// Data Backup and Restore (JSON)
export const exportFullUserDataJSON = (): string => {
  const exportPayload = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    userState: getStoredUserState(),
    workoutLogs: getStoredWorkoutLogs(),
    achievements: getStoredAchievements()
  };
  return JSON.stringify(exportPayload, null, 2);
};

export const importFullUserDataJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.userState) saveUserState(data.userState);
    if (data.workoutLogs) saveWorkoutLogs(data.workoutLogs);
    if (data.achievements) saveAchievements(data.achievements);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
};
