export type MuscleGroup = 
  | 'chest' 
  | 'abs' 
  | 'quads' 
  | 'glutes' 
  | 'triceps' 
  | 'shoulders' 
  | 'back' 
  | 'calves' 
  | 'hamstrings' 
  | 'obliques';

export type ExerciseCategory = 
  | 'full_body' 
  | 'cardio' 
  | 'core' 
  | 'upper_body' 
  | 'lower_body' 
  | 'flexibility';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type AnimationType = 
  | 'jumping_jacks'
  | 'wall_sit'
  | 'pushups'
  | 'crunches'
  | 'step_ups'
  | 'squats'
  | 'tricep_dips'
  | 'plank'
  | 'high_knees'
  | 'lunges'
  | 'pushup_rotation'
  | 'side_plank'
  | 'burpees'
  | 'mountain_climbers'
  | 'bicycle_crunches'
  | 'glute_bridge'
  | 'superman'
  | 'calf_raises'
  | 'shadow_boxing'
  | 'cat_cow';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  animationType: AnimationType;
  difficulty: DifficultyLevel;
  isLowImpact: boolean; // safe for knees / apartment friendly
  defaultDurationSec: number; // usually 30s
  caloriesPerMinute: number;
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  coachCues: {
    start: string;
    halfway: string;
    finalStretch: string;
  };
}

export interface WorkoutExercise {
  exerciseId: string;
  durationSec: number;
  restSec: number;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  iconName: string;
  color: string; // Tailwind color class e.g. 'rose' | 'amber' | 'emerald' | 'blue' | 'purple'
  exercises: WorkoutExercise[];
  isCustom?: boolean;
  circuits?: number;
  prepTimeSec?: number;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutTitle: string;
  date: string; // ISO date string
  timestamp: number;
  durationSeconds: number;
  caloriesBurned: number;
  completedExercisesCount: number;
  totalExercisesCount: number;
  coachUsedId: string;
  completedFull: boolean;
}

export type CoachPersonality = 'drill' | 'cheerleader' | 'zen' | 'robot' | 'minimal';

export interface Coach {
  id: CoachPersonality;
  name: string;
  title: string;
  avatarEmoji: string;
  description: string;
  speechPitch: number;
  speechRate: number;
  accentColor: string;
  welcomeLine: string;
  phrases: {
    ready: string[];
    start: string[];
    halfway: string[];
    almostDone: string[];
    rest: string[];
    nextExercise: string[];
    workoutComplete: string[];
    slackingWarning?: string[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'workouts' | 'variety' | 'special';
  unlockedAt?: number | null;
  progress: number;
  maxProgress: number;
}

export interface UserFitnessProfile {
  name: string;
  fitnessLevel: DifficultyLevel;
  goal: 'fat_loss' | 'strength' | 'endurance' | 'mobility' | 'general_fit';
  weeklyGoalDays: number;
  isLowImpactOnly: boolean;
  dailyReminderTime?: string;
  joinedDate: string;
}

export interface UserState {
  hearts: number; // Max 3, Seven style!
  lastWorkoutDate: string | null;
  currentStreak: number;
  longestStreak: number;
  totalWorkoutsCompleted: number;
  totalMinutesSweated: number;
  totalCaloriesBurned: number;
  profile: UserFitnessProfile;
  selectedCoachId: CoachPersonality;
  activePlanId?: string | null;
  planWeek?: number;
  theme: 'dark' | 'light' | 'oled';
  voiceVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  speechEnabled: boolean;
  sfxEnabled: boolean;
  hapticEnabled: boolean;
  keepScreenAwake: boolean;
  unlockedAchievements: string[];
  customWorkouts: WorkoutRoutine[];
}
