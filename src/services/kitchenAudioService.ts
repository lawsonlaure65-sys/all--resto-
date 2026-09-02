// Web Audio API Synthesizer for Kitchen Chime & Order Bells in Allôresto Niamey

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a resonant 3-tone chime (Ding-Dong-Chime) for incoming orders
 */
export function playKitchenOrderChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Frequencies for a bright, pleasant restaurant service bell chord (C6, E6, G6, C7)
    const tones = [
      { freq: 1046.5, delay: 0, duration: 0.8, gainVal: 0.35 },    // C6
      { freq: 1318.51, delay: 0.12, duration: 0.9, gainVal: 0.4 },  // E6
      { freq: 1567.98, delay: 0.25, duration: 1.2, gainVal: 0.45 }, // G6
      { freq: 2093.0, delay: 0.4, duration: 1.6, gainVal: 0.5 },    // C7
    ];

    tones.forEach(({ freq, delay, duration, gainVal }) => {
      const startTime = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Combine sine and slight triangle for crisp bell strike
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Attack and exponential natural decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch (err) {
    console.warn("Audio chime play error:", err);
  }
}

/**
 * Play an urgent double alert sound for fast delivery handover
 */
export function playCourierHandoverSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const beeps = [0, 0.18];

    beeps.forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now + delay); // A5

      gain.gain.setValueAtTime(0.01, now + delay);
      gain.gain.linearRampToValueAtTime(0.3, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.13);
    });
  } catch (err) {
    console.warn("Courier sound error:", err);
  }
}
