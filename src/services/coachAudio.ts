import { Coach, CoachPersonality } from '../types/workout';
import { COACHES } from '../data/coaches';

class CoachAudioEngine {
  private audioCtx: AudioContext | null = null;
  private synth: SpeechSynthesis | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private voiceVolume: number = 0.9;
  private speechEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private wakeLock: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  public setVolumes(sfx: number, voice: number, sfxOn: boolean, speechOn: boolean) {
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.voiceVolume = Math.max(0, Math.min(1, voice));
    this.sfxEnabled = sfxOn;
    this.speechEnabled = speechOn;
  }

  // --- Haptics (Vibration API) ---
  public triggerHaptic(pattern: number | number[] = 100) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore if not supported or disabled in browser
      }
    }
  }

  // --- Screen Wake Lock API ---
  public async requestWakeLock(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        return true;
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
        return false;
      }
    }
    return false;
  }

  public releaseWakeLock() {
    if (this.wakeLock) {
      try {
        this.wakeLock.release();
      } catch (e) {}
      this.wakeLock = null;
    }
  }

  // --- Web Audio API Procedural Sound Effects ---
  public playCountdownBeep(isFinal: boolean = false) {
    if (!this.sfxEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = isFinal ? 880 : 440; // A5 vs A4
      const duration = isFinal ? 0.35 : 0.15;

      osc.type = isFinal ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (isFinal) {
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3); // Ramp to C6
      }

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4 * this.sfxVolume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      this.triggerHaptic(isFinal ? [100, 50, 200] : 60);
    } catch (e) {
      console.warn('Sound beep error', e);
    }
  }

  public playWhistle() {
    if (!this.sfxEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Dual oscillator referee whistle
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const mainGain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2400, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2430, now);

      // Tremolo modulation
      lfo.frequency.setValueAtTime(24, now);
      lfoGain.gain.setValueAtTime(250, now);
      lfo.connect(osc1.frequency);
      lfo.connect(osc2.frequency);

      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.35 * this.sfxVolume, now + 0.05);
      mainGain.gain.setValueAtTime(0.35 * this.sfxVolume, now + 0.4);
      mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc1.connect(mainGain);
      osc2.connect(mainGain);
      mainGain.connect(ctx.destination);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);

      lfo.stop(now + 0.55);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);

      this.triggerHaptic([80, 40, 120]);
    } catch (e) {
      console.warn('Whistle error', e);
    }
  }

  public playHalfwayChime() {
    if (!this.sfxEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Two bell tones (Ding-Dong)
      const freqs = [587.33, 880]; // D5, A5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0.001, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.4 * this.sfxVolume, now + idx * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.6);
      });

      this.triggerHaptic([70, 70, 70]);
    } catch (e) {
      console.warn('Halfway chime error', e);
    }
  }

  public playRestChime() {
    if (!this.sfxEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(392.00, now + 0.35); // G4 drop

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35 * this.sfxVolume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
      this.triggerHaptic(120);
    } catch (e) {}
  }

  public playVictoryFanfare() {
    if (!this.sfxEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0.0, d: 0.15 }, // C5
        { f: 659.25, t: 0.15, d: 0.15 }, // E5
        { f: 783.99, t: 0.3, d: 0.15 }, // G5
        { f: 1046.50, t: 0.45, d: 0.6 } // C6 (long hold)
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.001, now + n.t);
        gain.gain.linearRampToValueAtTime(0.4 * this.sfxVolume, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });

      this.triggerHaptic([100, 50, 100, 50, 300]);
    } catch (e) {}
  }

  // --- Voice Coach Speech Synthesis ---
  public speakPhrase(text: string, coachPersonality: CoachPersonality = 'drill') {
    if (!this.speechEnabled || coachPersonality === 'minimal') return;
    if (!this.synth || typeof window === 'undefined') return;

    try {
      // Cancel previous pending speech to stay in sync with workout intervals
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const coach = COACHES[coachPersonality] || COACHES.drill;

      utterance.rate = coach.speechRate;
      utterance.pitch = coach.speechPitch;
      utterance.volume = this.voiceVolume;

      // Select good voice if available
      const voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        // Try finding matching gender / personality tone if possible
        if (coachPersonality === 'cheerleader') {
          const female = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Google US English')));
          if (female) utterance.voice = female;
        } else if (coachPersonality === 'drill') {
          const male = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Fred') || v.name.includes('Guy')));
          if (male) utterance.voice = male;
        } else {
          const eng = voices.find(v => v.lang.startsWith('en'));
          if (eng) utterance.voice = eng;
        }
      }

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  public speakRandomCue(
    category: 'ready' | 'start' | 'halfway' | 'almostDone' | 'rest' | 'workoutComplete',
    coachId: CoachPersonality = 'drill'
  ) {
    const coach = COACHES[coachId];
    if (!coach || coachId === 'minimal') return;
    const pool = coach.phrases[category];
    if (pool && pool.length > 0) {
      const phrase = pool[Math.floor(Math.random() * pool.length)];
      this.speakPhrase(phrase, coachId);
    }
  }

  public stopAll() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.releaseWakeLock();
  }
}

export const coachAudio = new CoachAudioEngine();
