// Web Audio API Procedural Audio Synthesizer for Driving Simulator

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Sound permanently OFF by default until user enables it

  // Engine sound nodes
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;

  // Horn nodes
  private hornGain: GainNode | null = null;
  private hornOsc1: OscillatorNode | null = null;
  private hornOsc2: OscillatorNode | null = null;

  // Tire squeal nodes
  private squealGain: GainNode | null = null;
  private squealOsc: OscillatorNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      if (this.ctx) {
        if (this.engineGain) {
          this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        if (this.hornGain) {
          this.hornGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        if (this.squealGain) {
          this.squealGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        if (this.ctx.state === 'running') {
          this.ctx.suspend();
        }
      }
    } else {
      this.initCtx();
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Engine Sound Setup & Update
  public updateEngine(rpm: number, throttle: number, isStalled: boolean, engineRunning: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (!engineRunning || isStalled) {
      if (this.engineGain) {
        this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      return;
    }

    if (!this.engineOsc1 || !this.engineOsc2) {
      // Setup Engine Synthesizer
      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc2 = this.ctx.createOscillator();
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineGain = this.ctx.createGain();

      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'triangle';

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.value = 400;

      this.engineGain.gain.value = 0.12;

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc1.start();
      this.engineOsc2.start();
    }

    const baseFreq = Math.max(30, (rpm / 800) * 35);
    const filterFreq = 300 + (rpm / 7000) * 1800 + throttle * 1200;
    const gainVal = 0.08 + (rpm / 7000) * 0.12 + throttle * 0.08;

    if (this.engineOsc1) {
      this.engineOsc1.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.05);
    }
    if (this.engineOsc2) {
      this.engineOsc2.frequency.setTargetAtTime(baseFreq * 1.5, this.ctx.currentTime, 0.05);
    }
    if (this.engineFilter) {
      this.engineFilter.frequency.setTargetAtTime(filterFreq, this.ctx.currentTime, 0.05);
    }
    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(gainVal, this.ctx.currentTime, 0.05);
    }
  }

  // Starter Engine Cranking
  public playStarter() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(90, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // Engine Stall SFX
  public playStall() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Horn
  public setHorn(active: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (active) {
      if (!this.hornOsc1) {
        this.hornOsc1 = this.ctx.createOscillator();
        this.hornOsc2 = this.ctx.createOscillator();
        this.hornGain = this.ctx.createGain();

        this.hornOsc1.type = 'sawtooth';
        this.hornOsc2.type = 'sawtooth';

        this.hornOsc1.frequency.value = 380;
        this.hornOsc2.frequency.value = 460;

        this.hornGain.gain.value = 0;

        this.hornOsc1.connect(this.hornGain);
        this.hornOsc2.connect(this.hornGain);
        this.hornGain.connect(this.ctx.destination);

        this.hornOsc1.start();
        this.hornOsc2.start();
      }
      if (this.hornGain) {
        this.hornGain.gain.setTargetAtTime(0.25, this.ctx.currentTime, 0.02);
      }
    } else {
      if (this.hornGain) {
        this.hornGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
      }
    }
  }

  // Gear Shift SFX
  public playGearShift(success: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (success) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } else {
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    }
  }

  // Tire Squeal / Drift
  public setTireSqueal(intensity: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (intensity > 0.1) {
      if (!this.squealOsc) {
        this.squealOsc = this.ctx.createOscillator();
        this.squealGain = this.ctx.createGain();

        this.squealOsc.type = 'sawtooth';
        this.squealOsc.frequency.value = 950;

        this.squealGain.gain.value = 0;

        this.squealOsc.connect(this.squealGain);
        this.squealGain.connect(this.ctx.destination);

        this.squealOsc.start();
      }
      if (this.squealGain && this.squealOsc) {
        const gainVal = Math.min(0.2, intensity * 0.2);
        this.squealGain.gain.setTargetAtTime(gainVal, this.ctx.currentTime, 0.05);
        this.squealOsc.frequency.setTargetAtTime(900 + intensity * 300, this.ctx.currentTime, 0.05);
      }
    } else {
      if (this.squealGain) {
        this.squealGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      }
    }
  }

  public playTurnSignalTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  public playCollision(speedKmH: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);

    const volume = Math.min(0.5, Math.max(0.1, speedKmH / 100));
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Speak Human Hindi Dialogue aloud when sound is enabled by user
  public speakHindiDialogue(hindiText: string) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      // Strip emojis before speaking
      const cleanText = hindiText.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.05;
      utterance.pitch = 1.05;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synthesis is unavailable
    }
  }
}

export const audioEngine = new AudioEngine();

