import React, { useState, useEffect, useRef } from 'react';
import { WorkoutRoutine, Exercise, CoachPersonality } from '../types/workout';
import { EXERCISES_DATABASE } from '../data/exercises';
import { COACHES } from '../data/coaches';
import { coachAudio } from '../services/coachAudio';
import { recordCompletedWorkout } from '../services/storage';
import { MannequinAnimation } from './MannequinAnimation';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Maximize2,
  Minimize2,
  Flame,
  Award,
  ChevronRight,
  Info,
  Clock,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveWorkoutProps {
  routine: WorkoutRoutine;
  selectedCoachId: CoachPersonality;
  onFinish: () => void;
  onExit: () => void;
}

type WorkoutPhase = 'prep' | 'work' | 'rest' | 'finished';

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  routine,
  selectedCoachId: initialCoachId,
  onFinish,
  onExit
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [phase, setPhase] = useState<WorkoutPhase>('prep');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentCoachId, setCurrentCoachId] = useState<CoachPersonality>(initialCoachId);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showFormGuide, setShowFormGuide] = useState<boolean>(false);

  // Time States
  const prepDuration = routine.prepTimeSec || 5;
  const currentWorkoutExercise = routine.exercises[currentExerciseIndex];
  const currentExerciseData: Exercise = EXERCISES_DATABASE[currentWorkoutExercise?.exerciseId] || EXERCISES_DATABASE['jumping_jacks'];
  const nextWorkoutExercise = routine.exercises[currentExerciseIndex + 1];
  const nextExerciseData: Exercise | null = nextWorkoutExercise ? EXERCISES_DATABASE[nextWorkoutExercise.exerciseId] : null;

  const [timeLeft, setTimeLeft] = useState<number>(prepDuration);
  const [totalTimeElapsedSec, setTotalTimeElapsedSec] = useState<number>(0);
  const [totalCalories, setTotalCalories] = useState<number>(0);

  // Summary on completion
  const [summaryData, setSummaryData] = useState<{
    newHearts: number;
    streak: number;
    unlockedBadges: any[];
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const halfwaySpokenRef = useRef<boolean>(false);
  const countdown3SpokenRef = useRef<boolean>(false);

  // Acquire Screen WakeLock
  useEffect(() => {
    coachAudio.requestWakeLock();
    return () => {
      coachAudio.releaseWakeLock();
      coachAudio.stopAll();
    };
  }, []);

  // Update volume & mute state
  useEffect(() => {
    if (isMuted) {
      coachAudio.setVolumes(0, 0, false, false);
    } else {
      coachAudio.setVolumes(0.8, 0.9, true, true);
    }
  }, [isMuted]);

  // Phase change triggers & audio announcements
  useEffect(() => {
    halfwaySpokenRef.current = false;
    countdown3SpokenRef.current = false;

    if (phase === 'prep') {
      setTimeLeft(prepDuration);
      coachAudio.speakPhrase(`Get ready for ${currentExerciseData.name}`, currentCoachId);
    } else if (phase === 'work') {
      setTimeLeft(currentWorkoutExercise.durationSec);
      coachAudio.playWhistle();
      setTimeout(() => {
        coachAudio.speakRandomCue('start', currentCoachId);
      }, 400);
    } else if (phase === 'rest') {
      setTimeLeft(currentWorkoutExercise.restSec || 10);
      coachAudio.playRestChime();
      setTimeout(() => {
        if (nextExerciseData) {
          coachAudio.speakPhrase(`Rest. Next up is ${nextExerciseData.name}`, currentCoachId);
        } else {
          coachAudio.speakPhrase(`Rest. Final exercise done!`, currentCoachId);
        }
      }, 500);
    } else if (phase === 'finished') {
      coachAudio.playVictoryFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        coachAudio.speakRandomCue('workoutComplete', currentCoachId);
      }, 800);

      // Record workout in storage
      const durationFinal = totalTimeElapsedSec;
      const calFinal = Math.max(25, Math.round(totalCalories));
      const res = recordCompletedWorkout(routine, durationFinal, calFinal, currentCoachId);
      setSummaryData({
        newHearts: res.updatedState.hearts,
        streak: res.updatedState.currentStreak,
        unlockedBadges: res.newlyUnlocked
      });
    }
  }, [phase, currentExerciseIndex, currentCoachId]);

  // Core Timer Interval Loop
  useEffect(() => {
    if (isPaused || phase === 'finished') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Halfway alert trigger
        if (phase === 'work') {
          const halfTime = Math.floor(currentWorkoutExercise.durationSec / 2);
          if (prev === halfTime && !halfwaySpokenRef.current) {
            halfwaySpokenRef.current = true;
            coachAudio.playHalfwayChime();
            setTimeout(() => {
              coachAudio.speakRandomCue('halfway', currentCoachId);
            }, 300);
          }
        }

        // 3-2-1 Countdown Beeps
        if (prev <= 4 && prev > 1) {
          coachAudio.playCountdownBeep(false);
        } else if (prev === 1) {
          coachAudio.playCountdownBeep(true);
        }

        if (prev <= 1) {
          // Advance Phase
          if (phase === 'prep') {
            setPhase('work');
          } else if (phase === 'work') {
            // Check if there are remaining exercises
            if (currentExerciseIndex < routine.exercises.length - 1) {
              setPhase('rest');
            } else {
              setPhase('finished');
            }
          } else if (phase === 'rest') {
            setCurrentExerciseIndex((idx) => idx + 1);
            setPhase('work');
          }
          return 0;
        }

        return prev - 1;
      });

      // Total Elapsed Time & Calories Counter
      setTotalTimeElapsedSec((t) => t + 1);
      if (phase === 'work') {
        const calSec = (currentExerciseData.caloriesPerMinute || 8) / 60;
        setTotalCalories((c) => c + calSec);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, currentExerciseIndex, currentCoachId, currentWorkoutExercise, currentExerciseData, routine.exercises.length]);

  // Navigation handlers
  const handleSkipNext = () => {
    if (currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex((i) => i + 1);
      setPhase('prep');
    } else {
      setPhase('finished');
    }
  };

  const handleSkipPrev = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((i) => i - 1);
      setPhase('prep');
    }
  };

  const adjustTime = (delta: number) => {
    setTimeLeft((prev) => Math.max(3, prev + delta));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Max duration for current active phase progress ring
  const currentMaxDuration =
    phase === 'prep'
      ? prepDuration
      : phase === 'work'
      ? currentWorkoutExercise.durationSec
      : currentWorkoutExercise.restSec || 10;

  const progressFraction = Math.max(0, Math.min(1, timeLeft / currentMaxDuration));
  const strokeDashoffset = 283 * (1 - progressFraction);

  // Format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 app-bg app-text flex flex-col justify-between select-none overflow-y-auto"
    >
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 app-header backdrop-blur-md border-b app-border shrink-0 sticky top-0 z-20">
        <button
          type="button"
          onClick={onExit}
          className="p-2 rounded-full app-text-sub hover:app-text app-card-hover transition-colors"
          aria-label="Exit Workout"
        >
          <X size={20} />
        </button>

        {/* Workout Progress Badge */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
            {routine.title}
          </span>
          <span className="text-[11px] app-text-sub font-medium">
            Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full app-text-sub hover:app-text app-card-hover transition-colors"
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={19} className="text-rose-500" /> : <Volume2 size={19} />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full app-text-sub hover:app-text app-card-hover transition-colors"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
          </button>
        </div>
      </div>

      {/* Main Active Workout View */}
      {phase !== 'finished' ? (
        <div className="flex-1 flex flex-col justify-between max-w-lg w-full mx-auto p-4 gap-3">
          {/* Top Info Strip: Coach Selector & Calories */}
          <div className="flex items-center justify-between app-card border app-border rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">{COACHES[currentCoachId]?.avatarEmoji}</span>
              <div>
                <div className="text-xs font-bold app-text">
                  {COACHES[currentCoachId]?.name}
                </div>
                <div className="text-[10px] app-text-sub">
                  {COACHES[currentCoachId]?.title}
                </div>
              </div>
            </div>

            {/* Quick Coach Picker dropdown */}
            <select
              value={currentCoachId}
              onChange={(e) => setCurrentCoachId(e.target.value as CoachPersonality)}
              className="text-xs app-card-subtle app-text font-semibold px-2 py-1 rounded-lg border app-border focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="drill">🪖 Sgt. Rex (Tough)</option>
              <option value="cheerleader">✨ Chloe (Cheer)</option>
              <option value="zen">🧘 Kai (Zen)</option>
              <option value="robot">🤖 Unit 7000 (Cyber)</option>
              <option value="minimal">🔔 Minimalist (Bells)</option>
            </select>
          </div>

          {/* Exercise Title and Phase Indicator */}
          <div className="text-center">
            <div className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-1 shadow-sm transition-colors duration-300">
              {phase === 'prep' && (
                <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full animate-pulse">
                  GET READY
                </span>
              )}
              {phase === 'work' && (
                <span className="bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 px-3 py-0.5 rounded-full">
                  WORK INTERVAL
                </span>
              )}
              {phase === 'rest' && (
                <span className="bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/40 px-3 py-0.5 rounded-full">
                  REST & RECOVER
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black app-text tracking-tight">
              {phase === 'rest' ? 'Rest Time' : currentExerciseData.name}
            </h2>

            {phase === 'rest' && nextExerciseData && (
              <p className="text-xs text-sky-600 dark:text-sky-300 font-medium mt-0.5">
                Up next: <span className="font-bold underline">{nextExerciseData.name}</span>
              </p>
            )}
          </div>

          {/* Biomechanical Model Animation Box */}
          <div className="relative">
            <MannequinAnimation
              animationType={phase === 'rest' ? 'plank' : currentExerciseData.animationType}
              targetMuscles={phase === 'rest' ? [] : currentExerciseData.targetMuscles}
              isRest={phase === 'rest'}
              exerciseName={phase === 'rest' ? 'Rest' : currentExerciseData.name}
              className="w-full h-56 md:h-64"
            />

            {/* Form tips toggle button */}
            <button
              type="button"
              onClick={() => setShowFormGuide(!showFormGuide)}
              className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] font-semibold app-card app-text border app-border rounded-full px-2.5 py-1 hover:app-card-hover backdrop-blur-md shadow-sm"
            >
              <Info size={13} className="text-rose-500" />
              {showFormGuide ? 'Hide Form Tips' : 'Form Tips'}
            </button>
          </div>

          {/* Form Guide Dropdown */}
          {showFormGuide && (
            <div className="app-card border app-border rounded-xl p-3 text-xs space-y-1.5 animate-fadeIn shadow-md">
              <div className="font-bold app-text">Form Checklist:</div>
              <ul className="list-disc list-inside space-y-1 app-text-sub">
                {currentExerciseData.formTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Large Countdown Circular Ring & Timer */}
          <div className="flex items-center justify-center relative my-1">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress dynamic ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className={`transition-all duration-300 ${
                  phase === 'prep'
                    ? 'text-amber-500'
                    : phase === 'work'
                    ? 'text-rose-500'
                    : 'text-sky-500'
                }`}
                strokeWidth="7"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Timer Center Digits */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black font-mono tracking-tighter app-text">
                {timeLeft}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest app-text-sub">
                Seconds
              </span>
            </div>
          </div>

          {/* Workout Stats Strip (Total Elapsed, Calories) */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="app-card-subtle border app-border rounded-xl py-2 px-3 shadow-sm">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold app-text-sub uppercase">
                <Clock size={12} className="text-sky-500" /> Total Time
              </div>
              <div className="text-base font-bold font-mono app-text">
                {formatTime(totalTimeElapsedSec)}
              </div>
            </div>

            <div className="app-card-subtle border app-border rounded-xl py-2 px-3 shadow-sm">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold app-text-sub uppercase">
                <Flame size={12} className="text-rose-500" /> Est. Calories
              </div>
              <div className="text-base font-bold font-mono app-text">
                {Math.round(totalCalories)} kcal
              </div>
            </div>
          </div>

          {/* Player Controller Action Bar */}
          <div className="flex items-center justify-center gap-4 py-2">
            {/* Prev Exercise */}
            <button
              type="button"
              onClick={handleSkipPrev}
              disabled={currentExerciseIndex === 0}
              className="p-3 rounded-full app-card border app-border app-text hover:app-card-hover disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 shadow-md"
              title="Previous Exercise"
            >
              <SkipBack size={20} />
            </button>

            {/* Quick -5s */}
            <button
              type="button"
              onClick={() => adjustTime(-5)}
              className="px-2.5 py-1.5 rounded-lg app-card border app-border text-xs font-mono font-bold app-text-sub hover:app-text hover:app-card-hover active:scale-95 transition-all"
            >
              -5s
            </button>

            {/* Play / Pause Primary Button */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-5 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white font-bold shadow-lg shadow-rose-600/40 hover:from-rose-500 hover:to-rose-400 active:scale-95 transition-all"
              aria-label={isPaused ? 'Resume workout' : 'Pause workout'}
            >
              {isPaused ? <Play size={28} className="fill-white translate-x-0.5" /> : <Pause size={28} className="fill-white" />}
            </button>

            {/* Quick +5s */}
            <button
              type="button"
              onClick={() => adjustTime(5)}
              className="px-2.5 py-1.5 rounded-lg app-card border app-border text-xs font-mono font-bold app-text-sub hover:app-text hover:app-card-hover active:scale-95 transition-all"
            >
              +5s
            </button>

            {/* Next Exercise */}
            <button
              type="button"
              onClick={handleSkipNext}
              className="p-3 rounded-full app-card border app-border app-text hover:app-card-hover active:scale-95 transition-all shadow-md"
              title="Next Exercise"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      ) : (
        /* Workout Finished Celebration Screen */
        <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto p-6 text-center animate-fadeIn space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-rose-500/40 animate-bounce">
              <Award size={48} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full uppercase shadow">
              COMPLETE
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black app-text tracking-tight">
              Workout Crushed!
            </h1>
            <p className="text-sm app-text-sub mt-1">
              {routine.title}
            </p>
          </div>

          {/* Hearts & Streak Status */}
          <div className="w-full app-card border app-border rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase app-text-sub">Seven Hearts Life</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    size={22}
                    className={`${
                      heartIndex <= (summaryData?.newHearts || 3)
                        ? 'text-rose-500 fill-rose-500 animate-pulse'
                        : 'text-slate-300 dark:text-slate-700 fill-slate-200 dark:fill-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t app-border">
              <span className="text-xs font-bold uppercase app-text-sub">Current Streak</span>
              <span className="text-base font-black text-amber-500 dark:text-amber-400 flex items-center gap-1">
                🔥 {summaryData?.streak || 1} Days
              </span>
            </div>
          </div>

          {/* Metric Recap Cards */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="app-card border app-border rounded-xl p-3 shadow-sm">
              <div className="text-xs app-text-sub">Total Duration</div>
              <div className="text-xl font-bold font-mono app-text mt-0.5">
                {formatTime(totalTimeElapsedSec)}
              </div>
            </div>

            <div className="app-card border app-border rounded-xl p-3 shadow-sm">
              <div className="text-xs app-text-sub">Calories Burned</div>
              <div className="text-xl font-bold font-mono text-rose-700 dark:text-rose-400 mt-0.5">
                {Math.round(totalCalories)} kcal
              </div>
            </div>
          </div>

          {/* Unlocked Badges */}
          {summaryData?.unlockedBadges && summaryData.unlockedBadges.length > 0 && (
            <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-left shadow-sm">
              <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <Award size={14} /> New Achievement Unlocked!
              </div>
              {summaryData.unlockedBadges.map((badge: any) => (
                <div key={badge.id} className="flex items-center gap-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <div className="text-sm font-bold app-text">{badge.title}</div>
                    <div className="text-xs app-text-sub">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Return Home Button */}
          <button
            type="button"
            onClick={onFinish}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-base shadow-lg shadow-rose-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Save & Finish
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
