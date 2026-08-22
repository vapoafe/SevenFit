import React, { useState } from 'react';
import { WorkoutRoutine, CoachPersonality, MuscleGroup } from '../types/workout';
import { EXERCISES_DATABASE } from '../data/exercises';
import { COACHES, COACH_LIST } from '../data/coaches';
import { MannequinAnimation } from './MannequinAnimation';
import {
  X,
  Play,
  Clock,
  Flame,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Volume2
} from 'lucide-react';

interface WorkoutDetailModalProps {
  routine: WorkoutRoutine;
  selectedCoachId: CoachPersonality;
  onSelectCoach: (coachId: CoachPersonality) => void;
  onStart: (routine: WorkoutRoutine) => void;
  onClose: () => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  routine,
  selectedCoachId,
  onSelectCoach,
  onStart,
  onClose
}) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [workDuration, setWorkDuration] = useState<number>(30);
  const [restDuration, setRestDuration] = useState<number>(10);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Compute total duration and muscle groups
  const totalExercises = routine.exercises.length;
  const totalDurationSec = totalExercises * (workDuration + restDuration);
  const totalMinutes = (totalDurationSec / 60).toFixed(1);

  // Collect unique targeted muscles
  const targetedMuscles = Array.from(
    new Set(
      routine.exercises.flatMap(
        (ex) => EXERCISES_DATABASE[ex.exerciseId]?.targetMuscles || []
      )
    )
  ) as MuscleGroup[];

  const handleStartWorkout = () => {
    // Clone routine with customized durations if adjusted
    const customizedRoutine: WorkoutRoutine = {
      ...routine,
      exercises: routine.exercises.map((ex) => ({
        ...ex,
        durationSec: workDuration,
        restSec: restDuration
      }))
    };
    onStart(customizedRoutine);
  };

  return (
    <div className="fixed inset-0 z-50 app-modal-backdrop backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="app-modal border app-border w-full max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b app-border flex items-start justify-between relative app-card-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40">
                {routine.category.replace('_', ' ')}
              </span>
              <span className="text-[11px] font-bold app-text-sub capitalize">
                {routine.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black app-text">{routine.title}</h2>
            <p className="text-xs sm:text-sm app-text-sub mt-1">{routine.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full app-text-sub hover:app-text app-card-hover transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="app-card-subtle border app-border rounded-xl p-2.5">
              <div className="text-[11px] font-semibold app-text-sub flex items-center justify-center gap-1">
                <Clock size={12} className="text-sky-500" /> Duration
              </div>
              <div className="text-base font-bold font-mono app-text mt-0.5">
                {totalMinutes} min
              </div>
            </div>

            <div className="app-card-subtle border app-border rounded-xl p-2.5">
              <div className="text-[11px] font-semibold app-text-sub flex items-center justify-center gap-1">
                <Layers size={12} className="text-amber-500" /> Exercises
              </div>
              <div className="text-base font-bold font-mono app-text mt-0.5">
                {totalExercises} drills
              </div>
            </div>

            <div className="app-card-subtle border app-border rounded-xl p-2.5">
              <div className="text-[11px] font-semibold app-text-sub flex items-center justify-center gap-1">
                <Flame size={12} className="text-rose-500" /> Calories
              </div>
              <div className="text-base font-bold font-mono app-text mt-0.5">
                ~{Math.round(totalExercises * 6)} kcal
              </div>
            </div>
          </div>

          {/* Target Muscles */}
          <div>
            <div className="text-xs font-bold uppercase app-text-sub mb-2">
              Targeted Muscle Groups:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {targetedMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg app-card-subtle text-rose-500 dark:text-rose-300 border app-border uppercase shadow-sm"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Coach Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase app-text-sub">
                Choose Voice Coach:
              </span>
              <span className="text-xs text-rose-500 font-semibold">
                {COACHES[selectedCoachId]?.name}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COACH_LIST.map((coach) => {
                const isSelected = selectedCoachId === coach.id;
                return (
                  <button
                    key={coach.id}
                    type="button"
                    onClick={() => onSelectCoach(coach.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 app-text shadow-md shadow-rose-500/10'
                        : 'app-card-subtle app-border app-text-sub hover:app-border-strong hover:app-text'
                    }`}
                  >
                    <span className="text-xl">{coach.avatarEmoji}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate app-text">
                        {coach.name}
                      </div>
                      <div className="text-[10px] truncate app-text-sub">
                        {coach.title.split(' ')[1] || 'Coach'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Interval Customizer Toggle */}
          <div className="border-t app-border pt-3">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center justify-between w-full text-xs font-bold uppercase app-text-sub hover:app-text"
            >
              <span>Interval Timing Settings</span>
              {showConfig ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showConfig && (
              <div className="grid grid-cols-2 gap-3 mt-3 app-card-subtle p-3 rounded-xl border app-border animate-fadeIn">
                <div>
                  <label className="text-xs app-text-sub block mb-1">
                    Work Time ({workDuration}s)
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs app-text-sub block mb-1">
                    Rest Time ({restDuration}s)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={restDuration}
                    onChange={(e) => setRestDuration(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Exercise Sequence List */}
          <div>
            <div className="text-xs font-bold uppercase app-text-sub mb-2.5">
              Exercise Circuit Breakdown ({totalExercises}):
            </div>
            <div className="space-y-2">
              {routine.exercises.map((item, idx) => {
                const ex = EXERCISES_DATABASE[item.exerciseId];
                if (!ex) return null;
                const isExpanded = expandedExerciseId === ex.id;

                return (
                  <div
                    key={idx}
                    className="app-card-subtle border app-border rounded-xl overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedExerciseId(isExpanded ? null : ex.id)
                      }
                      className="w-full p-3 flex items-center justify-between text-left hover:app-card-hover transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full app-card app-text font-mono text-xs font-bold flex items-center justify-center border app-border">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-sm font-bold app-text">
                            {ex.name}
                          </div>
                          <div className="text-[11px] app-text-sub">
                            {workDuration}s work · {restDuration}s rest
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {ex.isLowImpact && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                            Joint Safe
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp size={16} className="app-text-muted" />
                        ) : (
                          <ChevronDown size={16} className="app-text-muted" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t app-border app-card space-y-3 animate-fadeIn">
                        {/* Live Model preview */}
                        <MannequinAnimation
                          animationType={ex.animationType}
                          targetMuscles={ex.targetMuscles}
                          exerciseName={ex.name}
                          className="h-48"
                        />

                        {/* Instructions */}
                        <div>
                          <div className="text-xs font-bold app-text mb-1">
                            How to perform:
                          </div>
                          <ol className="list-decimal list-inside space-y-1 text-xs app-text-sub">
                            {ex.instructions.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Form Tips */}
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                          <div className="text-[11px] font-bold text-rose-500 dark:text-rose-300 mb-1">
                            Pro Tips:
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] app-text">
                            {ex.formTips.map((tip, tIdx) => (
                              <li key={tIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Start Button Footer */}
        <div className="p-4 border-t app-border app-card backdrop-blur-md">
          <button
            type="button"
            onClick={handleStartWorkout}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-base shadow-xl shadow-rose-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play size={20} className="fill-white" />
            Start 7-Minute Workout
          </button>
        </div>
      </div>
    </div>
  );
};
