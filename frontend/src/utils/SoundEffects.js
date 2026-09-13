// Web Audio API Synthesizer for futuristic sci-fi interface feedback
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playBlip(freq = 600, type = 'sine', duration = 0.08) {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Graceful fallback
    }
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.playBlip(520, 'triangle', 0.12);
    setTimeout(() => this.playBlip(880, 'sine', 0.25), 90);
  }

  playBeacon() {
    if (!this.enabled || !this.ctx) return;
    this.playBlip(440, 'sine', 0.15);
    setTimeout(() => this.playBlip(660, 'sine', 0.15), 120);
    setTimeout(() => this.playBlip(990, 'sine', 0.3), 240);
  }
}

export const sfx = new SoundEffects();
