import React, { useState } from 'react';
import { EXERCISE_LIST, EXERCISES_DATABASE } from '../data/exercises';
import { Exercise, ExerciseCategory, MuscleGroup } from '../types/workout';
import { MannequinAnimation } from './MannequinAnimation';
import { coachAudio } from '../services/coachAudio';
import {
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

export const ExerciseLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories: { label: string; value: ExerciseCategory | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Full Body', value: 'full_body' },
    { label: 'Core & Abs', value: 'core' },
    { label: 'Cardio', value: 'cardio' },
    { label: 'Upper Body', value: 'upper_body' },
    { label: 'Lower Body', value: 'lower_body' },
    { label: 'Flexibility', value: 'flexibility' }
  ];

  const muscles: { label: string; value: MuscleGroup | 'all' }[] = [
    { label: 'All Muscles', value: 'all' },
    { label: 'Abs / Core', value: 'abs' },
    { label: 'Chest', value: 'chest' },
    { label: 'Quads & Legs', value: 'quads' },
    { label: 'Glutes', value: 'glutes' },
    { label: 'Triceps / Arms', value: 'triceps' },
    { label: 'Shoulders', value: 'shoulders' },
    { label: 'Back', value: 'back' },
    { label: 'Calves', value: 'calves' }
  ];

  const filteredExercises = EXERCISE_LIST.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' || ex.category === selectedCategory;

    const matchesMuscle =
      selectedMuscle === 'all' ||
      ex.targetMuscles.includes(selectedMuscle) ||
      ex.secondaryMuscles?.includes(selectedMuscle);

    return matchesSearch && matchesCat && matchesMuscle;
  });

  const playVoiceCue = (cue: string) => {
    coachAudio.speakPhrase(cue, 'drill');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black app-text tracking-tight">Exercise Library</h1>
        <p className="text-xs app-text-sub mt-1">
          Explore scientific exercises with animated biomechanical models and form guides.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 app-text-muted"
        />
        <input
          type="text"
          placeholder="Search by exercise or muscle group..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full app-card border app-border rounded-xl pl-10 pr-4 py-2.5 text-sm app-text placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 app-text-sub hover:app-text"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setSelectedCategory(c.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.value
                ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                : 'app-card app-text-sub border app-border hover:app-text hover:app-card-hover'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Muscle Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {muscles.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setSelectedMuscle(m.value)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              selectedMuscle === m.value
                ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/50'
                : 'app-card-subtle app-text-sub border app-border hover:app-text hover:app-card-hover'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => setSelectedExercise(ex)}
            className="app-card border app-border hover:border-rose-500/40 rounded-2xl p-4 transition-all cursor-pointer hover:shadow-lg group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded app-card-subtle text-rose-700 dark:text-rose-300 border app-border">
                      {ex.category.replace('_', ' ')}
                    </span>
                    {ex.isLowImpact && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Joint Safe
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black app-text group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                    {ex.name}
                  </h3>
                </div>
                <ChevronRight
                  size={18}
                  className="app-text-muted group-hover:app-text group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </div>

              {/* Target Muscles */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {ex.targetMuscles.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] uppercase font-bold app-text-sub app-card-subtle px-1.5 py-0.5 rounded border app-border"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <p className="text-xs app-text-sub mt-2 line-clamp-2">
                {ex.instructions[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 app-modal-backdrop backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="app-modal border app-border w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b app-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40">
                  {selectedExercise.category.replace('_', ' ')}
                </span>
                <h2 className="text-xl font-black app-text mt-1">
                  {selectedExercise.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded-full app-text-sub hover:app-text app-card-hover"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Mannequin Live Model */}
              <MannequinAnimation
                animationType={selectedExercise.animationType}
                targetMuscles={selectedExercise.targetMuscles}
                exerciseName={selectedExercise.name}
                className="h-56"
              />

              {/* Target Muscles */}
              <div>
                <div className="text-xs font-bold uppercase app-text-sub mb-1.5">
                  Primary Target Muscles:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedExercise.targetMuscles.map((m) => (
                    <span
                      key={m}
                      className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40"
                    >
                      {m}
                    </span>
                  ))}
                  {selectedExercise.secondaryMuscles?.map((m) => (
                    <span
                      key={m}
                      className="text-xs font-semibold uppercase px-2 py-1 rounded-lg app-card-subtle app-text-sub border app-border"
                    >
                      {m} (secondary)
                    </span>
                  ))}
                </div>
              </div>

              {/* Step by step Instructions */}
              <div>
                <div className="text-xs font-bold uppercase app-text-sub mb-1.5">
                  Step-by-Step Instructions:
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs app-text app-card-subtle p-3 rounded-xl border app-border">
                  {selectedExercise.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Form Tips */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase mb-1.5">
                  <CheckCircle size={14} /> Proper Form Tips:
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs app-text">
                  {selectedExercise.formTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase mb-1.5">
                  <AlertTriangle size={14} /> Common Mistakes to Avoid:
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs app-text">
                  {selectedExercise.commonMistakes.map((mistake, i) => (
                    <li key={i}>{mistake}</li>
                  ))}
                </ul>
              </div>

              {/* Coach Voice Cue Test */}
              <div className="app-card-subtle border app-border rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs font-bold app-text">Coach Cue Audio Preview:</div>
                  <div className="text-[11px] app-text-sub italic mt-0.5">
                    "{selectedExercise.coachCues.start}"
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => playVoiceCue(selectedExercise.coachCues.start)}
                  className="p-2.5 rounded-xl bg-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition-all shrink-0 border border-rose-500/40"
                  title="Listen to coach cue"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
