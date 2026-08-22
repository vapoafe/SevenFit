import React, { useState } from 'react';
import { WorkoutRoutine, Exercise } from '../types/workout';
import { EXERCISE_LIST, EXERCISES_DATABASE } from '../data/exercises';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Play,
  Save,
  Clock,
  Sparkles,
  Check,
  X
} from 'lucide-react';

interface CustomWorkoutBuilderProps {
  customWorkouts: WorkoutRoutine[];
  onSaveCustomWorkout: (workout: WorkoutRoutine) => void;
  onDeleteCustomWorkout: (id: string) => void;
  onSelectRoutine: (routine: WorkoutRoutine) => void;
}

export const CustomWorkoutBuilder: React.FC<CustomWorkoutBuilderProps> = ({
  customWorkouts,
  onSaveCustomWorkout,
  onDeleteCustomWorkout,
  onSelectRoutine
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [workSec, setWorkSec] = useState<number>(30);
  const [restSec, setRestSec] = useState<number>(10);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([
    'jumping_jacks',
    'pushups',
    'squats',
    'crunches',
    'plank'
  ]);

  const handleAddExercise = (id: string) => {
    setSelectedExerciseIds([...selectedExerciseIds, id]);
  };

  const handleRemoveExercise = (index: number) => {
    const updated = [...selectedExerciseIds];
    updated.splice(index, 1);
    setSelectedExerciseIds(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selectedExerciseIds];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSelectedExerciseIds(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= selectedExerciseIds.length - 1) return;
    const updated = [...selectedExerciseIds];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSelectedExerciseIds(updated);
  };

  const handleSave = () => {
    if (!title.trim() || selectedExerciseIds.length === 0) return;

    const newRoutine: WorkoutRoutine = {
      id: 'custom_' + Date.now(),
      title: title.trim(),
      subtitle: `${selectedExerciseIds.length} exercises · Custom circuit`,
      description: description.trim() || 'Custom user created interval routine.',
      category: 'full_body',
      difficulty: 'intermediate',
      iconName: 'Sparkles',
      color: 'amber',
      isCustom: true,
      prepTimeSec: 5,
      exercises: selectedExerciseIds.map((id) => ({
        exerciseId: id,
        durationSec: workSec,
        restSec: restSec
      }))
    };

    onSaveCustomWorkout(newRoutine);
    setIsCreating(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black app-text tracking-tight">
            Custom Routines
          </h1>
          <p className="text-xs app-text-sub mt-1">
            Build and personalize your own custom interval workouts.
          </p>
        </div>

        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus size={16} />
            Create Routine
          </button>
        )}
      </div>

      {/* Routine Creator Form */}
      {isCreating ? (
        <div className="app-card border app-border rounded-3xl p-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black app-text flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              New Custom Routine
            </h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1.5 rounded-full app-text-sub hover:app-text"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase app-text-sub block mb-1">
              Routine Title *
            </label>
            <input
              type="text"
              placeholder="e.g. My Morning Shred"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full app-card-subtle border app-border rounded-xl px-3.5 py-2 text-sm app-text placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase app-text-sub block mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Quick high-energy routine before work"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full app-card-subtle border app-border rounded-xl px-3.5 py-2 text-sm app-text placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Timing sliders */}
          <div className="grid grid-cols-2 gap-3 app-card-subtle p-3 rounded-xl border app-border">
            <div>
              <label className="text-xs app-text-sub block mb-1">
                Work Interval: <span className="font-bold text-rose-500">{workSec}s</span>
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={workSec}
                onChange={(e) => setWorkSec(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs app-text-sub block mb-1">
                Rest Interval: <span className="font-bold text-sky-500">{restSec}s</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={restSec}
                onChange={(e) => setRestSec(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Selected Exercise Sequence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase app-text-sub">
                Exercise Sequence ({selectedExerciseIds.length}):
              </span>
              <span className="text-xs app-text-sub">
                ~{Math.round((selectedExerciseIds.length * (workSec + restSec)) / 60)} min total
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {selectedExerciseIds.map((exId, idx) => {
                const ex = EXERCISES_DATABASE[exId];
                if (!ex) return null;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between app-card-subtle p-2.5 rounded-xl border app-border"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full app-card text-[11px] font-bold app-text-sub flex items-center justify-center border app-border">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold app-text">{ex.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 app-text-sub hover:app-text disabled:opacity-20"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === selectedExerciseIds.length - 1}
                        className="p-1 app-text-sub hover:app-text disabled:opacity-20"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="p-1 text-rose-500 hover:text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add more exercises picker */}
          <div>
            <label className="text-xs font-bold uppercase app-text-sub block mb-1.5">
              Add Exercise to Routine:
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {EXERCISE_LIST.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleAddExercise(ex.id)}
                  className="p-2 rounded-xl app-card-subtle hover:app-card-hover border app-border text-left flex items-center justify-between text-xs transition-colors"
                >
                  <span className="app-text truncate">{ex.name}</span>
                  <Plus size={14} className="text-rose-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 py-2.5 rounded-xl app-card-subtle app-text text-xs font-bold hover:app-card-hover border app-border"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim() || selectedExerciseIds.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-500/20"
            >
              Save Custom Routine
            </button>
          </div>
        </div>
      ) : null}

      {/* List of Custom Workouts */}
      {customWorkouts.length === 0 && !isCreating ? (
        <div className="app-card border border-dashed app-border rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full app-card-subtle flex items-center justify-center mx-auto app-text-sub border app-border">
            <Sparkles size={24} />
          </div>
          <div className="text-sm font-bold app-text">No Custom Routines Yet</div>
          <p className="text-xs app-text-sub max-w-xs mx-auto">
            Design your ideal interval workout circuit by choosing your favorite exercises and timing.
          </p>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
          >
            Create Your First Routine
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {customWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="app-card border app-border rounded-2xl p-4 flex items-center justify-between hover:border-rose-500/40 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                    Custom Circuit
                  </span>
                  <span className="text-xs app-text-sub font-medium">
                    {workout.exercises.length} drills
                  </span>
                </div>
                <h3 className="text-base font-bold app-text">{workout.title}</h3>
                <p className="text-xs app-text-sub mt-0.5">{workout.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onDeleteCustomWorkout(workout.id)}
                  className="p-2 rounded-xl app-text-muted hover:text-rose-500 hover:app-card-hover transition-colors"
                  title="Delete Routine"
                >
                  <Trash2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRoutine(workout)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <Play size={14} className="fill-white" />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
