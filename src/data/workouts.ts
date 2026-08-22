import { WorkoutRoutine } from '../types/workout';

export const PRESET_WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'classic_7_min',
    title: 'Classic 7-Minute Full Body',
    subtitle: 'The original scientific ACSM 12-exercise interval circuit',
    description: 'Based on the scientific high-intensity circuit training (HICT) study from the American College of Sports Medicine. Alternates upper body, lower body, and core with high aerobic spikes.',
    category: 'full_body',
    difficulty: 'beginner',
    iconName: 'Flame',
    color: 'rose',
    prepTimeSec: 5,
    exercises: [
      { exerciseId: 'jumping_jacks', durationSec: 30, restSec: 10 },
      { exerciseId: 'wall_sit', durationSec: 30, restSec: 10 },
      { exerciseId: 'pushups', durationSec: 30, restSec: 10 },
      { exerciseId: 'crunches', durationSec: 30, restSec: 10 },
      { exerciseId: 'step_ups', durationSec: 30, restSec: 10 },
      { exerciseId: 'squats', durationSec: 30, restSec: 10 },
      { exerciseId: 'tricep_dips', durationSec: 30, restSec: 10 },
      { exerciseId: 'plank', durationSec: 30, restSec: 10 },
      { exerciseId: 'high_knees', durationSec: 30, restSec: 10 },
      { exerciseId: 'lunges', durationSec: 30, restSec: 10 },
      { exerciseId: 'pushup_rotation', durationSec: 30, restSec: 10 },
      { exerciseId: 'side_plank', durationSec: 30, restSec: 10 }
    ]
  },
  {
    id: 'core_blast_7_min',
    title: '7-Minute Core & Six-Pack Shred',
    subtitle: 'High density abdominal, oblique, and spinal stabilizer routine',
    description: 'Carve your abdominal wall and tighten your waistline with focused isometric and dynamic rotational core work.',
    category: 'core',
    difficulty: 'intermediate',
    iconName: 'Zap',
    color: 'amber',
    prepTimeSec: 5,
    exercises: [
      { exerciseId: 'plank', durationSec: 35, restSec: 10 },
      { exerciseId: 'crunches', durationSec: 30, restSec: 10 },
      { exerciseId: 'bicycle_crunches', durationSec: 30, restSec: 10 },
      { exerciseId: 'mountain_climbers', durationSec: 30, restSec: 10 },
      { exerciseId: 'side_plank', durationSec: 35, restSec: 10 },
      { exerciseId: 'glute_bridge', durationSec: 30, restSec: 10 },
      { exerciseId: 'superman', durationSec: 30, restSec: 10 },
      { exerciseId: 'crunches', durationSec: 30, restSec: 10 },
      { exerciseId: 'bicycle_crunches', durationSec: 30, restSec: 10 },
      { exerciseId: 'plank', durationSec: 35, restSec: 10 }
    ]
  },
  {
    id: 'fat_torch_hiit',
    title: '7-Minute Fat Torch HIIT',
    subtitle: 'Maximum calorie burn with rapid interval cardio spikes',
    description: 'Pumps your heart rate into the fat oxidation threshold with explosive full-body movements designed for post-exercise oxygen consumption (EPOC).',
    category: 'cardio',
    difficulty: 'advanced',
    iconName: 'Activity',
    color: 'emerald',
    prepTimeSec: 5,
    exercises: [
      { exerciseId: 'jumping_jacks', durationSec: 30, restSec: 10 },
      { exerciseId: 'burpees', durationSec: 30, restSec: 10 },
      { exerciseId: 'high_knees', durationSec: 30, restSec: 10 },
      { exerciseId: 'mountain_climbers', durationSec: 30, restSec: 10 },
      { exerciseId: 'squats', durationSec: 30, restSec: 10 },
      { exerciseId: 'shadow_boxing', durationSec: 30, restSec: 10 },
      { exerciseId: 'burpees', durationSec: 30, restSec: 10 },
      { exerciseId: 'jumping_jacks', durationSec: 30, restSec: 10 },
      { exerciseId: 'high_knees', durationSec: 30, restSec: 10 },
      { exerciseId: 'shadow_boxing', durationSec: 30, restSec: 10 }
    ]
  },
  {
    id: 'upper_body_power',
    title: '7-Minute Upper Body Power',
    subtitle: 'Chest, triceps, shoulders, and back hypertrophy focus',
    description: 'Sculpt your arms, widen your shoulders, and build functional upper body pushing and stabilizing strength with zero weights.',
    category: 'upper_body',
    difficulty: 'intermediate',
    iconName: 'Shield',
    color: 'blue',
    prepTimeSec: 5,
    exercises: [
      { exerciseId: 'pushups', durationSec: 30, restSec: 10 },
      { exerciseId: 'tricep_dips', durationSec: 30, restSec: 10 },
      { exerciseId: 'pushup_rotation', durationSec: 30, restSec: 10 },
      { exerciseId: 'plank', durationSec: 35, restSec: 10 },
      { exerciseId: 'superman', durationSec: 30, restSec: 10 },
      { exerciseId: 'shadow_boxing', durationSec: 30, restSec: 10 },
      { exerciseId: 'pushups', durationSec: 30, restSec: 10 },
      { exerciseId: 'tricep_dips', durationSec: 30, restSec: 10 },
      { exerciseId: 'pushup_rotation', durationSec: 30, restSec: 10 },
      { exerciseId: 'superman', durationSec: 30, restSec: 10 }
    ]
  },
  {
    id: 'lower_body_glutes',
    title: '7-Minute Lower Body & Glutes',
    subtitle: 'Toned quads, hamstrings, calves, and strong glute activation',
    description: 'Target your largest muscle groups for athletic speed, functional jumping power, and firm, lifted glutes.',
    category: 'lower_body',
    difficulty: 'beginner',
    iconName: 'Sparkles',
    color: 'purple',
    prepTimeSec: 5,
    exercises: [
      { exerciseId: 'squats', durationSec: 30, restSec: 10 },
      { exerciseId: 'wall_sit', durationSec: 30, restSec: 10 },
      { exerciseId: 'lunges', durationSec: 30, restSec: 10 },
      { exerciseId: 'step_ups', durationSec: 30, restSec: 10 },
      { exerciseId: 'glute_bridge', durationSec: 30, restSec: 10 },
      { exerciseId: 'squats', durationSec: 30, restSec: 10 },
      { exerciseId: 'lunges', durationSec: 30, restSec: 10 },
      { exerciseId: 'wall_sit', durationSec: 30, restSec: 10 },
      { exerciseId: 'glute_bridge', durationSec: 30, restSec: 10 }
    ]
  },
  {
    id: 'low_impact_gentle',
    title: '7-Minute Low Impact & Joint-Safe',
    subtitle: 'Zero jumping, apartment friendly & kind to knees',
    description: '100% no-jump, quiet movements that protect knees and ankles while delivering full metabolic activation. Ideal for apartments and early mornings.',
    category: 'flexibility',
    difficulty: 'beginner',
    iconName: 'Heart',
    color: 'teal',
    prepTimeSec: 5,
    exercises: [
      { exerciseId: 'wall_sit', durationSec: 30, restSec: 10 },
      { exerciseId: 'squats', durationSec: 30, restSec: 10 },
      { exerciseId: 'crunches', durationSec: 30, restSec: 10 },
      { exerciseId: 'glute_bridge', durationSec: 30, restSec: 10 },
      { exerciseId: 'pushups', durationSec: 30, restSec: 10 },
      { exerciseId: 'plank', durationSec: 30, restSec: 10 },
      { exerciseId: 'superman', durationSec: 30, restSec: 10 },
      { exerciseId: 'lunges', durationSec: 30, restSec: 10 },
      { exerciseId: 'shadow_boxing', durationSec: 30, restSec: 10 },
      { exerciseId: 'side_plank', durationSec: 30, restSec: 10 }
    ]
  }
];

export interface PlanWeekDay {
  dayIndex: number; // 1 to 7
  dayName: string;
  workoutId: string;
  focus: string;
  isRest?: boolean;
}

export interface PersonalizedPlan {
  id: string;
  title: string;
  goal: string;
  description: string;
  totalWeeks: number;
  badgeAwarded: string;
  schedule: Record<number, PlanWeekDay[]>; // weekNum -> days
}

export const GENERATE_PERSONALIZED_PLAN = (
  level: string,
  goal: string,
  lowImpact: boolean
): PersonalizedPlan => {
  const isBeginner = level === 'beginner';
  const isAdv = level === 'advanced';

  let title = '7-Minute Balanced Health';
  let desc = 'Build a sustainable daily habit with steady progress.';
  let mainWorkout = 'classic_7_min';

  if (lowImpact) {
    title = 'Joint-Friendly Low Impact 4-Week Habit';
    desc = 'Low-impact interval circuits to build muscle and stamina safely.';
    mainWorkout = 'low_impact_gentle';
  } else if (goal === 'fat_loss') {
    title = '7-Minute Fat-Loss & Metabolism Accelerator';
    desc = 'High-frequency HIIT & cardio circuits to supercharge calorie burn.';
    mainWorkout = isAdv ? 'fat_torch_hiit' : 'classic_7_min';
  } else if (goal === 'strength') {
    title = 'Bodyweight Strength & Power 30-Day Blueprint';
    desc = 'Progressive overload on upper, lower, and core foundational calisthenics.';
    mainWorkout = 'upper_body_power';
  } else if (goal === 'endurance') {
    title = 'Cardio Stamina & Conditioning Program';
    desc = 'Boost lung capacity, heart rate endurance, and recovery speed.';
    mainWorkout = 'fat_torch_hiit';
  }

  const days: PlanWeekDay[] = [
    { dayIndex: 1, dayName: 'Monday', workoutId: mainWorkout, focus: 'Full Intensity Launch' },
    { dayIndex: 2, dayName: 'Tuesday', workoutId: 'core_blast_7_min', focus: 'Core & Stability' },
    { dayIndex: 3, dayName: 'Wednesday', workoutId: lowImpact ? 'low_impact_gentle' : 'lower_body_glutes', focus: 'Lower Body Drive' },
    { dayIndex: 4, dayName: 'Thursday', workoutId: '', focus: 'Active Recovery & Hydrate', isRest: true },
    { dayIndex: 5, dayName: 'Friday', workoutId: 'upper_body_power', focus: 'Upper Strength' },
    { dayIndex: 6, dayName: 'Saturday', workoutId: 'classic_7_min', focus: 'Weekend Mastery Circuit' },
    { dayIndex: 7, dayName: 'Sunday', workoutId: '', focus: 'Deep Sleep & Recharge', isRest: true }
  ];

  return {
    id: `plan_${goal}_${level}_${lowImpact ? 'low' : 'norm'}`,
    title,
    goal,
    description: desc,
    totalWeeks: 4,
    badgeAwarded: 'Plan Champion',
    schedule: {
      1: days,
      2: days,
      3: days,
      4: days
    }
  };
};
