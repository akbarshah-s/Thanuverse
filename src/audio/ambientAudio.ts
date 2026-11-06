// Web Audio API ambient soundscape generator and romantic sound effects for THANUVERSE

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Sound nodes
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private cricketsGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Running states
  private rainSource: AudioBufferSourceNode | null = null;
  private cricketsInterval: any = null;
  private musicInterval: any = null;
  private heartbeatInterval: any = null;

  public isMuted = false;
  public isMusicPlaying = false;
  public isRainPlaying = false;
  public isCricketsPlaying = false;
  public currentTrackTitle = "Two Worlds, One Moon";

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      this.cricketsGain = this.ctx.createGain();
      this.cricketsGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.cricketsGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.isInitialized = true;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Romantic Lo-Fi Piano Synthesizer
  // Plays pentatonic warm romantic chords: Db, Fm, Bbm, Gb, Ab (Studio Ghibli / Makoto Shinkai feel)
  public toggleMusic(play?: boolean): boolean {
    this.initContext();
    if (!this.ctx || !this.musicGain) return false;

    const target = play !== undefined ? play : !this.isMusicPlaying;
    this.isMusicPlaying = target;

    if (this.isMusicPlaying) {
      this.startLofiPianoLoop();
    } else {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
    }
    return this.isMusicPlaying;
  }

  private startLofiPianoLoop() {
    if (this.musicInterval) clearInterval(this.musicInterval);

    // Warm chord progressions (frequencies in Hz)
    const chords = [
      // Dbmaj7: Db3 (138.59), F3 (174.61), Ab3 (207.65), C4 (261.63), F4 (349.23)
      [138.59, 174.61, 207.65, 261.63, 349.23],
      // Fm7: F2 (87.31), C3 (130.81), Ab3 (207.65), C4 (261.63), Eb4 (311.13)
      [87.31, 130.81, 207.65, 261.63, 311.13],
      // Bbm7: Bb2 (116.54), F3 (174.61), Bb3 (233.08), Db4 (277.18), F4 (349.23)
      [116.54, 174.61, 233.08, 277.18, 349.23],
      // Gbmaj7: Gb2 (92.50), Db3 (138.59), Bb3 (233.08), Db4 (277.18), F4 (349.23)
      [92.50, 138.59, 233.08, 277.18, 349.23],
    ];

    let chordIdx = 0;
    const playChordStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      // Arpeggiate slightly for romantic human feel
      currentChord.forEach((freq, noteIdx) => {
        const noteDelay = noteIdx * 0.12;
        setTimeout(() => {
          if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
          this.playPianoTone(freq, 3.8);
        }, noteDelay * 1000);
      });
    };

    playChordStep();
    this.musicInterval = setInterval(playChordStep, 4500);
  }

  private playPianoTone(freq: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm vintage lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    // Warm sine + subtle triangle blend
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  // Rain sound generator using filtered pink noise
  public toggleRain(play?: boolean): boolean {
    this.initContext();
    if (!this.ctx || !this.rainGain) return false;

    const target = play !== undefined ? play : !this.isRainPlaying;
    this.isRainPlaying = target;

    if (this.isRainPlaying) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.08;
      }

      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = buffer;
      this.rainSource.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(650, this.ctx.currentTime);

      this.rainSource.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainSource.start();
    } else {
      if (this.rainSource) {
        try {
          this.rainSource.stop();
          this.rainSource.disconnect();
        } catch (e) {}
        this.rainSource = null;
      }
    }
    return this.isRainPlaying;
  }

  // Night crickets chirp generator
  public toggleCrickets(play?: boolean): boolean {
    this.initContext();
    if (!this.ctx || !this.cricketsGain) return false;

    const target = play !== undefined ? play : !this.isCricketsPlaying;
    this.isCricketsPlaying = target;

    if (this.isCricketsPlaying) {
      const chirp = () => {
        if (!this.isCricketsPlaying || !this.ctx || !this.cricketsGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(4500 + Math.random() * 300, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);

        osc.connect(gain);
        gain.connect(this.cricketsGain);

        osc.start(now);
        osc.stop(now + 0.1);
      };

      this.cricketsInterval = setInterval(() => {
        if (Math.random() > 0.3) {
          chirp();
          setTimeout(chirp, 120);
          if (Math.random() > 0.5) setTimeout(chirp, 240);
        }
      }, 1400);
    } else {
      if (this.cricketsInterval) {
        clearInterval(this.cricketsInterval);
        this.cricketsInterval = null;
      }
    }
    return this.isCricketsPlaying;
  }

  // Heartbeat sound: rhythmic "lub-dub" low acoustic pulse
  public playHeartbeatPulse() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Lub (low 55Hz)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Dub (slightly softer, 0.18s later)
    setTimeout(() => {
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(75, t);
      osc2.frequency.exponentialRampToValueAtTime(50, t + 0.14);
      gain2.gain.setValueAtTime(0.28, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(t);
      osc2.stop(t + 0.2);
    }, 180);
  }

  // Ethereal Hug Chime
  public playHugChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.0);
    });
  }

  // Kiss sparkle sound
  public playKissSparkle() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // "I miss you" gentle ping
  public playMissYouPing() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.1); // D6
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.3);
  }

  // Moon Connection Harmonize
  public playMoonHarmonize() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // Cosmic pad chord (F, A, C, E, G, C)
    const freqs = [174.61, 220.00, 261.63, 329.63, 392.00, 523.25];
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 4.5);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 4.8);
    });
  }

  // Master mute toggle
  public setMasterMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }
}

export const ambientSound = new AmbientSoundEngine();
