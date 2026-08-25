// Audio synthesizer utility for Allôresto using Web Audio API
// Generates pleasant, native sound notifications without external file dependencies

export class SoundNotificationManager {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Load preference from localStorage if available
    try {
      const saved = localStorage.getItem("alloresto_sound_enabled");
      if (saved !== null) {
        this.soundEnabled = saved === "true";
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem("alloresto_sound_enabled", String(enabled));
    } catch {
      // ignore
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.soundEnabled);
    if (this.soundEnabled) {
      this.playPing();
    }
    return this.soundEnabled;
  }

  private getAudioContext(): AudioContext | null {
    if (!this.soundEnabled) return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  // 1. Pleasant Item Added to Cart Sound (soft marimba chord)
  public playCartAdd(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.05);

        gain.gain.setValueAtTime(0, now + index * 0.05);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.05);
        osc.stop(now + index * 0.05 + 0.3);
      });
    } catch {
      // ignore audio errors
    }
  }

  // 2. Order Placed / Success Sound (cheerful celebratory chime)
  public playOrderSuccess(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0 },    // C5
        { f: 659.25, t: 0.1 },  // E5
        { f: 783.99, t: 0.2 },  // G5
        { f: 1046.5, t: 0.35 }, // C6
      ];

      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.f, now + note.t);

        gain.gain.setValueAtTime(0, now + note.t);
        gain.gain.linearRampToValueAtTime(0.18, now + note.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.t);
        osc.stop(now + note.t + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // 3. Status Update Sound (two-tone soft notification)
  public playStatusUpdate(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const tones = [587.33, 880]; // D5 -> A5

      tones.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.14, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.28);
      });
    } catch {
      // ignore
    }
  }

  // 4. Marketing Promo & Flash Sale alert (upbeat sparkles)
  public playPromoAlert(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [784, 988, 1175, 1318].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // 5. Short Ping for UI interactions
  public playPing(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundNotificationManager();

// Convenience global functions
export function playSoundCartAdd(): void {
  soundManager.playCartAdd();
}

export function playSoundOrderConfirmed(): void {
  soundManager.playOrderSuccess();
}

export function playSoundStatusUpdate(): void {
  soundManager.playStatusUpdate();
}

export function playSoundPromoApplied(): void {
  soundManager.playPromoAlert();
}

export function playSoundSuccessChime(): void {
  soundManager.playOrderSuccess();
}
