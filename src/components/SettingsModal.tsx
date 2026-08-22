import React, { useState } from 'react';
import { UserState, CoachPersonality } from '../types/workout';
import { COACHES, COACH_LIST } from '../data/coaches';
import { coachAudio } from '../services/coachAudio';
import {
  exportFullUserDataJSON,
  importFullUserDataJSON
} from '../services/storage';
import {
  X,
  Volume2,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Vibrate,
  Eye,
  Check,
  Globe
} from 'lucide-react';

interface SettingsModalProps {
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onClose: () => void;
  onOpenTestingGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  userState,
  onUpdateUserState,
  onClose,
  onOpenTestingGuide
}) => {
  const [copiedBackup, setCopiedBackup] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const handleCoachChange = (coachId: CoachPersonality) => {
    const updated = { ...userState, selectedCoachId: coachId };
    onUpdateUserState(updated);
    coachAudio.speakPhrase(COACHES[coachId]?.welcomeLine || 'Coach selected', coachId);
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'oled') => {
    const updated = { ...userState, theme };
    onUpdateUserState(updated);

    // Apply document theme class
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-dark', 'theme-light', 'theme-oled', 'dark', 'light', 'oled');
      root.setAttribute('data-theme', theme);
      root.classList.add(`theme-${theme}`);
      if (theme === 'dark' || theme === 'oled') {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    }
  };

  const handleExportData = () => {
    const json = exportFullUserDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seven_workout_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importFullUserDataJSON(content);
      if (success) {
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setImportError('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all workout history and stats? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 app-modal-backdrop backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="app-modal border app-border w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b app-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black app-text">App Settings</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full app-text-sub hover:app-text app-card-hover"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Appearance / Theme Selector */}
          <div>
            <label className="text-xs font-bold uppercase app-text-sub block mb-2">
              Appearance / Night Workout Theme:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: 'Dark Navy', icon: <Moon size={16} /> },
                { id: 'oled', label: 'OLED Black', icon: <Eye size={16} /> },
                { id: 'light', label: 'Light Mode', icon: <Sun size={16} /> }
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleThemeChange(th.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    userState.theme === th.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300 shadow-sm'
                      : 'app-card-subtle app-border app-text-sub hover:app-text hover:app-card-hover'
                  }`}
                >
                  {th.icon}
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Coach Voice Selection & Audition */}
          <div>
            <label className="text-xs font-bold uppercase app-text-sub block mb-2">
              Default Voice Cheer Coach:
            </label>
            <div className="space-y-2">
              {COACH_LIST.map((coach) => {
                const isSelected = userState.selectedCoachId === coach.id;
                return (
                  <div
                    key={coach.id}
                    onClick={() => handleCoachChange(coach.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 app-text shadow-md shadow-rose-500/10'
                        : 'app-card-subtle app-border app-text-sub hover:app-border-strong hover:app-text'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{coach.avatarEmoji}</span>
                      <div>
                        <div className="text-sm font-bold app-text flex items-center gap-2">
                          {coach.name}
                          {isSelected && (
                            <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-rose-500 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs app-text-sub">
                          {coach.description}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        coachAudio.speakPhrase(coach.welcomeLine, coach.id);
                      }}
                      className="p-2 rounded-xl app-card-subtle hover:app-card-hover app-text-sub hover:app-text shrink-0 ml-2 border app-border"
                      title="Test Coach Voice"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sound & Audio Toggles */}
          <div className="space-y-3 app-card-subtle p-4 rounded-2xl border app-border">
            <div className="text-xs font-bold uppercase app-text-sub">
              Audio & Haptics
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold app-text">
                  Voice Speech Coaching
                </div>
                <div className="text-[11px] app-text-sub">
                  Speaks motivational cues and countdowns
                </div>
              </div>
              <input
                type="checkbox"
                checked={userState.speechEnabled}
                onChange={(e) => {
                  const updated = { ...userState, speechEnabled: e.target.checked };
                  onUpdateUserState(updated);
                  coachAudio.setVolumes(userState.sfxVolume, userState.voiceVolume, userState.sfxEnabled, e.target.checked);
                }}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold app-text">
                  Bells, Whistles & Sound FX
                </div>
                <div className="text-[11px] app-text-sub">
                  Synthesized interval cues and halfway chimes
                </div>
              </div>
              <input
                type="checkbox"
                checked={userState.sfxEnabled}
                onChange={(e) => {
                  const updated = { ...userState, sfxEnabled: e.target.checked };
                  onUpdateUserState(updated);
                  coachAudio.setVolumes(userState.sfxVolume, userState.voiceVolume, e.target.checked, userState.speechEnabled);
                }}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold app-text">
                  Vibration Haptic Feedback
                </div>
                <div className="text-[11px] app-text-sub">
                  Vibrates phone on interval start and finish
                </div>
              </div>
              <input
                type="checkbox"
                checked={userState.hapticEnabled}
                onChange={(e) => {
                  const updated = { ...userState, hapticEnabled: e.target.checked };
                  onUpdateUserState(updated);
                }}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold app-text">
                  Keep Screen Awake (Wake Lock)
                </div>
                <div className="text-[11px] app-text-sub">
                  Prevents screen from sleeping during workouts
                </div>
              </div>
              <input
                type="checkbox"
                checked={userState.keepScreenAwake}
                onChange={(e) => {
                  const updated = { ...userState, keepScreenAwake: e.target.checked };
                  onUpdateUserState(updated);
                }}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Offline & Privacy Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300 text-xs font-black uppercase">
              <Shield size={16} /> 100% Offline & Privacy-First
            </div>
            <p className="text-xs app-text-sub leading-relaxed">
              No tracking, no telemetry, no analytics, no external servers, and zero advertisements. All workout logs and audio synthesizers execute 100% locally on your device.
            </p>
          </div>

          {/* GitHub Pages, License & Testing Guide Button */}
          <button
            type="button"
            onClick={onOpenTestingGuide}
            className="w-full p-3.5 rounded-2xl app-card-subtle hover:app-card-hover border app-border app-text text-xs font-bold flex items-center justify-between transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Globe size={18} className="text-sky-500" />
              <span>GitHub Pages, FOSS License & Mobile Guide</span>
            </div>
            <HelpCircle size={16} className="app-text-muted" />
          </button>

          {/* Data Export & Backup */}
          <div className="space-y-2 pt-2 border-t app-border">
            <div className="text-xs font-bold uppercase app-text-sub">
              Data Management & Backup (JSON)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportData}
                className="py-2.5 px-3 rounded-xl app-card-subtle hover:app-card-hover app-text text-xs font-bold border app-border flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={14} /> Export Backup
              </button>

              <label className="py-2.5 px-3 rounded-xl app-card-subtle hover:app-card-hover app-text text-xs font-bold border app-border flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload size={14} /> Import Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {importSuccess && (
              <div className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <Check size={14} /> Backup imported successfully! Reloading...
              </div>
            )}
            {importError && (
              <div className="text-xs text-rose-500 font-semibold">{importError}</div>
            )}
          </div>

          {/* Reset button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetData}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-bold border border-rose-500/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} /> Reset All Workout History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
