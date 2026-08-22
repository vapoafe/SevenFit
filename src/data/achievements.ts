import { Achievement } from '../types/workout';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_sweat',
    title: 'First Sweat',
    description: 'Complete your very first 7-minute workout session.',
    icon: '🔥',
    category: 'workouts',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'streak_3',
    title: 'Spark of Consistency',
    description: 'Build a 3-day continuous workout streak.',
    icon: '⚡',
    category: 'streak',
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'streak_7',
    title: '7-Day Champion',
    description: 'Maintain a 7-day streak without losing a single heart.',
    icon: '👑',
    category: 'streak',
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'streak_30',
    title: 'Habit of Iron',
    description: 'Reach a phenomenal 30-day streak of daily fitness.',
    icon: '🏆',
    category: 'streak',
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'workouts_10',
    title: 'Tenacious Ten',
    description: 'Complete 10 total workout sessions.',
    icon: '🎯',
    category: 'workouts',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'workouts_50',
    title: 'Fitness Veteran',
    description: 'Complete 50 total workout sessions.',
    icon: '🏅',
    category: 'workouts',
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'sweat_60m',
    title: 'Hour of Power',
    description: 'Accumulate 60 minutes of total high-intensity sweat time.',
    icon: '⏱️',
    category: 'workouts',
    progress: 0,
    maxProgress: 60
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a workout before 8:00 AM.',
    icon: '🌅',
    category: 'special',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a workout after 9:00 PM.',
    icon: '🌙',
    category: 'special',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'all_coaches',
    title: 'Coach Enthusiast',
    description: 'Train with Rex, Sparky, Guru Kai, and Unit 7000.',
    icon: '🎙️',
    category: 'variety',
    progress: 0,
    maxProgress: 4
  },
  {
    id: 'custom_builder',
    title: 'Master Architect',
    description: 'Create and save your own custom workout routine.',
    icon: '🛠️',
    category: 'special',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'core_specialist',
    title: 'Steel Core',
    description: 'Complete 5 Core & Six-Pack Shred sessions.',
    icon: '🛡️',
    category: 'variety',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'hiit_master',
    title: 'Fat Torch Beast',
    description: 'Complete 5 Fat Torch HIIT high-intensity sessions.',
    icon: '💥',
    category: 'variety',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Complete workouts on both Saturday and Sunday.',
    icon: '🌟',
    category: 'special',
    progress: 0,
    maxProgress: 2
  }
];
