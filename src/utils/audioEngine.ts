/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Web Audio API Synthesis Engine for PardehNegar & Continuum Acusticum.
 * Features:
 * - Acoustic Piano synthesis (hammer strike, multiple detuned harmonics, soundboard decay)
 * - Classical & Persian Violin synthesis with expressive bow vibrato LFO and body formant filter
 * - Historical continuum instruments: Santur, Țambal, Setar, Bouzouki, Ney, Caval
 * - Persian & Danubian percussion synthesizer (Tombak Tom, Tombak Bak, Daf, Carpathian Toacă)
 * - Melodic scale sequences, daramad motif player, and triad chord playback
 * - Microtonally accurate pitch with Koron (-45 cents), Sori (+30 cents), and Koma offsets
 */

export type TimbreType = 'piano' | 'violin' | 'santur' | 'tambal' | 'setar' | 'bouzouki' | 'ney' | 'caval';
export type ArticulationType = 'glissando' | 'staccato';
export type PercussionSound = 'tombak_tom' | 'tombak_bak' | 'daf' | 'clapper';

export interface SequenceStep {
  midi: number;
  dur: number;
  centOffset?: number;
}

class SynthesizerEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private metronomeGain: GainNode | null = null;
  private treatiseGain: GainNode | null = null;
  private treatiseOscs: OscillatorNode[] = [];
  private treatiseFilter: BiquadFilterNode | null = null;
  private isTreatiseActive: boolean = false;
  private analyser: AnalyserNode | null = null;
  private activeVoices: Set<{ stop: () => void }> = new Set();
  private scheduledTimerIds: number[] = [];
  private isMuted: boolean = false;

  public initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      this.metronomeGain = this.ctx.createGain();
      this.metronomeGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.metronomeGain.connect(this.ctx.destination);

      this.treatiseGain = this.ctx.createGain();
      this.treatiseGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.treatiseGain.connect(this.ctx.destination);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public setVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public setMetronomeVolume(val: number) {
    this.initContext();
    if (this.metronomeGain && this.ctx) {
      this.metronomeGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public setTreatiseVolume(val: number) {
    this.initContext();
    if (this.treatiseGain && this.ctx) {
      this.treatiseGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.isMuted ? 0 : 0.75);
    this.setMetronomeVolume(this.isMuted ? 0 : 0.85);
    return this.isMuted;
  }

  public stopAll() {
    for (const tid of this.scheduledTimerIds) {
      window.clearTimeout(tid);
    }
    this.scheduledTimerIds = [];

    for (const voice of this.activeVoices) {
      try {
        voice.stop();
      } catch {
        // Voice might already be ended
      }
    }
    this.activeVoices.clear();
  }

  public midiToFreq(midi: number, centOffset = 0): number {
    const baseFreq = 440 * Math.pow(2, (midi - 69) / 12);
    return baseFreq * Math.pow(2, centOffset / 1200);
  }

  /**
   * Play a single voice with specified timbre, articulation, and microtonal pitch
   */
  public playNote(
    midi: number,
    centOffset = 0,
    timbre: TimbreType = 'piano',
    articulation: ArticulationType = 'glissando',
    duration = 1.6,
    startTimeOffset = 0
  ): { stop: () => void } {
    this.initContext();
    if (!this.ctx || !this.masterGain) return { stop: () => {} };

    const t0 = this.ctx.currentTime + startTimeOffset;
    const freq = this.midiToFreq(midi, centOffset);

    const voiceGain = this.ctx.createGain();
    voiceGain.connect(this.masterGain);

    const nodesToStop: (AudioNode & { stop?: (when?: number) => void })[] = [];

    if (timbre === 'piano') {
      // Acoustic piano synthesis: hammer impulse + multi-harmonic decay
      const dur = articulation === 'staccato' ? 0.22 : duration;
      voiceGain.gain.setValueAtTime(0.0001, t0);
      voiceGain.gain.exponentialRampToValueAtTime(0.85, t0 + 0.004);
      voiceGain.gain.exponentialRampToValueAtTime(0.4, t0 + 0.08);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      // Lowpass filter simulating felt hammer softness on velocity
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(9000, freq * 7), t0);
      filter.frequency.exponentialRampToValueAtTime(Math.min(2500, freq * 2), t0 + dur * 0.8);
      filter.connect(voiceGain);

      // 3 slightly detuned oscillators for authentic piano string chorus
      const detunes = [-1.5, 0, 1.8];
      const harmonicGains = [0.6, 0.25, 0.15];

      detunes.forEach((cents, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        osc.detune.setValueAtTime(cents, t0);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(harmonicGains[idx], t0);

        osc.connect(subGain);
        subGain.connect(filter);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
        nodesToStop.push(osc);
      });

      // Hammer click transient
      const clickBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.015), this.ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickData.length; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickData.length * 0.2));
      }
      const clickSource = this.ctx.createBufferSource();
      clickSource.buffer = clickBuffer;
      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.18, t0);
      clickSource.connect(clickGain);
      clickGain.connect(filter);
      clickSource.start(t0);
      nodesToStop.push(clickSource);

    } else if (timbre === 'violin') {
      // Bowed violin synthesis: sawtooth core, violin body formant filter, expressive vibrato LFO
      const dur = articulation === 'staccato' ? 0.24 : duration;
      const attackTime = articulation === 'staccato' ? 0.015 : 0.08;

      voiceGain.gain.setValueAtTime(0.0001, t0);
      voiceGain.gain.exponentialRampToValueAtTime(0.7, t0 + attackTime);
      voiceGain.gain.setValueAtTime(0.65, t0 + dur * 0.7);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      // Violin body formant biquad filter (simulating maple/spruce resonances around 2800Hz & 500Hz)
      const bodyFilter = this.ctx.createBiquadFilter();
      bodyFilter.type = 'bandpass';
      bodyFilter.frequency.setValueAtTime(Math.max(300, Math.min(3200, freq * 2.2)), t0);
      bodyFilter.Q.setValueAtTime(1.8, t0);
      bodyFilter.connect(voiceGain);

      // Main sawtooth oscillator (bow friction)
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t0);

      // Vibrato LFO (5.6 Hz, enters gently after 0.1s for natural human bow nuance)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(5.6, t0);

      if (articulation === 'staccato') {
        lfoGain.gain.setValueAtTime(0, t0);
      } else {
        lfoGain.gain.setValueAtTime(0, t0);
        lfoGain.gain.linearRampToValueAtTime(14, t0 + 0.25); // ~14 cents vibrato depth
      }

      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);

      osc.connect(bodyFilter);
      osc.start(t0);
      lfo.start(t0);
      osc.stop(t0 + dur + 0.05);
      lfo.stop(t0 + dur + 0.05);
      nodesToStop.push(osc);
      nodesToStop.push(lfo);

    } else {
      // Historical continuum instruments (Santur, Țambal, Setar, Bouzouki, Ney, Caval)
      const dur = articulation === 'staccato' ? 0.25 : duration;
      const isWinds = timbre === 'ney' || timbre === 'caval';
      const attack = isWinds ? 0.08 : (timbre === 'santur' ? 0.004 : 0.008);

      voiceGain.gain.setValueAtTime(0.0001, t0);
      voiceGain.gain.exponentialRampToValueAtTime(0.65, t0 + attack);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      const filter = this.ctx.createBiquadFilter();
      filter.type = isWinds ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(timbre === 'santur' ? 5200 : (timbre === 'bouzouki' ? 6200 : 3500), t0);
      filter.Q.setValueAtTime(isWinds ? 2.5 : 1.2, t0);
      filter.connect(voiceGain);

      const osc = this.ctx.createOscillator();
      osc.type = isWinds ? 'sine' : (timbre === 'setar' ? 'triangle' : 'sawtooth');
      osc.frequency.setValueAtTime(freq, t0);
      osc.connect(filter);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
      nodesToStop.push(osc);
    }

    const voiceHandle = {
      stop: () => {
        try {
          voiceGain.gain.setTargetAtTime(0.0001, this.ctx?.currentTime || 0, 0.02);
          nodesToStop.forEach(n => {
            if (n.stop) n.stop();
          });
        } catch {}
        this.activeVoices.delete(voiceHandle);
      }
    };

    this.activeVoices.add(voiceHandle);
    return voiceHandle;
  }

  /**
   * Synthesize acoustic percussion hit
   */
  public playPercussion(sound: PercussionSound, volume = 0.8) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t0 = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.9, t0);
    gain.connect(this.masterGain);

    if (sound === 'tombak_tom') {
      // Warm bass boom with pitch sweep: 135Hz dropping to 60Hz
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(135, t0);
      osc.frequency.exponentialRampToValueAtTime(58, t0 + 0.12);

      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.95 * volume, t0 + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.38);

      osc.connect(gain);
      osc.start(t0);
      osc.stop(t0 + 0.4);

    } else if (sound === 'tombak_bak') {
      // High crisp rim strike: pitch at 360Hz + noise snap
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, t0);
      osc.frequency.exponentialRampToValueAtTime(180, t0 + 0.05);

      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.85 * volume, t0 + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);

      osc.connect(gain);
      osc.start(t0);
      osc.stop(t0 + 0.16);

    } else if (sound === 'daf') {
      // Frame drum slap + metallic zang shimmer
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.22), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, t0);
      filter.Q.setValueAtTime(3.0, t0);

      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.75 * volume, t0 + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      noise.start(t0);

    } else if (sound === 'clapper') {
      // Danubian / Carpathian wooden toacă clapper
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(840, t0);
      osc.frequency.exponentialRampToValueAtTime(420, t0 + 0.03);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t0);
      filter.Q.setValueAtTime(4.0, t0);

      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.9 * volume, t0 + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      osc.start(t0);
      osc.stop(t0 + 0.1);
    }
  }

  /**
   * Pure Metronome Click: Studio DAW standard click (Cubase / ProTools style)
   * High click (accent = 'high', beat 1): 1600 Hz fast impulse
   * Low click (accent = 'low', subsequent beats): 1000 Hz fast impulse
   */
  public playMetronomeClick(accent: 'high' | 'low' = 'low', volume = 0.85) {
    this.initContext();
    if (!this.ctx || !this.metronomeGain) return;

    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freq = accent === 'high' ? 1600 : 1000;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t0);

    const peak = (accent === 'high' ? 0.95 : 0.75) * volume;
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.0015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.026);

    osc.connect(gain);
    gain.connect(this.metronomeGain);

    osc.start(t0);
    osc.stop(t0 + 0.035);
  }

  /**
   * Start / Stop Background Ambient Drone for Scholarly Treatise Reading & Study
   */
  public isTreatiseAudioPlaying(): boolean {
    return this.isTreatiseActive;
  }

  public startTreatiseAudio() {
    this.initContext();
    if (!this.ctx || !this.treatiseGain || this.isTreatiseActive) return;

    this.stopTreatiseAudio();
    this.isTreatiseActive = true;

    const t0 = this.ctx.currentTime;
    // Harmonic drone bed on C3 (130.8Hz) and G3 (196Hz) with gentle lowpass filter
    this.treatiseFilter = this.ctx.createBiquadFilter();
    this.treatiseFilter.type = 'lowpass';
    this.treatiseFilter.frequency.setValueAtTime(750, t0);
    this.treatiseFilter.connect(this.treatiseGain);

    const baseFreqs = [130.81, 196.00, 261.63, 392.00];
    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.treatiseFilter) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t0);
      oscGain.gain.setValueAtTime(0.001, t0);
      oscGain.gain.linearRampToValueAtTime(0.12 / (idx + 1), t0 + 1.5);

      osc.connect(oscGain);
      oscGain.connect(this.treatiseFilter);
      osc.start(t0);
      this.treatiseOscs.push(osc);
    });
  }

  public stopTreatiseAudio() {
    if (this.ctx) {
      for (const osc of this.treatiseOscs) {
        try {
          osc.stop();
        } catch {
          // Ignore
        }
      }
    }
    this.treatiseOscs = [];
    this.isTreatiseActive = false;
  }

  /**
   * Play an ascending and descending scale demonstration across 10-12 seconds
   */
  public playScaleSequence(
    scaleMidiNotes: number[],
    microCents: Record<number, number> = {},
    timbre: TimbreType = 'piano',
    articulation: ArticulationType = 'glissando',
    onNoteTrigger?: (midi: number) => void,
    onComplete?: () => void
  ) {
    this.stopAll();
    this.initContext();

    // Ascend then descend
    const sequence: number[] = [...scaleMidiNotes];
    for (let i = scaleMidiNotes.length - 2; i >= 0; i--) {
      sequence.push(scaleMidiNotes[i]);
    }

    const stepIntervalMs = Math.max(220, Math.min(500, Math.floor(10000 / sequence.length)));

    sequence.forEach((midi, idx) => {
      const tid = window.setTimeout(() => {
        const pitchClass = midi % 12;
        const centOffset = microCents[pitchClass] || 0;
        this.playNote(midi, centOffset, timbre, articulation, 0.55);
        if (onNoteTrigger) onNoteTrigger(midi);

        if (idx === sequence.length - 1 && onComplete) {
          const finishTid = window.setTimeout(onComplete, 700);
          this.scheduledTimerIds.push(finishTid);
        }
      }, idx * stepIntervalMs);

      this.scheduledTimerIds.push(tid);
    });
  }

  /**
   * Extended Continuum Acusticum Performance Suite (30-40 seconds)
   * Beautiful, cohesive multi-phrase journey:
   * Phase 1: Iranian Plateau (Santur & Ney in Dastgah Shur with Koron)
   * Phase 2: Anatolian Bridge (Setar & Bouzouki in Makam Ussak)
   * Phase 3: Danubian & Carpathian Basin (Țambal & Caval in Doina and lively Hora)
   */
  public playContinuumSuite(
    onPhaseChange?: (phase: string) => void,
    onComplete?: () => void
  ): () => void {
    this.stopAll();
    this.initContext();

    interface SuiteStep {
      midi: number;
      centOffset: number;
      timbre: TimbreType;
      durationSec: number;
      stepGapSec: number;
      phaseName: string;
    }

    const suiteSteps: SuiteStep[] = [
      // Phase 1: Iranian Plateau - Santur & Ney in Shur (G4, A4 Koron, Bb4, C5, D5)
      { midi: 67, centOffset: 0, timbre: 'santur', durationSec: 1.2, stepGapSec: 0.9, phaseName: 'فلات کهن ایران (سنتور - درآمد شور)' },
      { midi: 69, centOffset: -45, timbre: 'santur', durationSec: 1.0, stepGapSec: 0.8, phaseName: 'فلات کهن ایران (سی کُرن - ریزپرده اصیل)' },
      { midi: 70, centOffset: 0, timbre: 'santur', durationSec: 1.0, stepGapSec: 0.8, phaseName: 'فلات کهن ایران (سنتور)' },
      { midi: 72, centOffset: 0, timbre: 'santur', durationSec: 1.4, stepGapSec: 1.1, phaseName: 'فلات کهن ایران (اوج دانگ اول)' },
      { midi: 74, centOffset: 0, timbre: 'ney', durationSec: 1.8, stepGapSec: 1.3, phaseName: 'فلات کهن ایران (نوای نای هفت‌بند)' },
      { midi: 72, centOffset: 0, timbre: 'ney', durationSec: 1.2, stepGapSec: 0.9, phaseName: 'فلات کهن ایران (تحریر نی)' },
      { midi: 70, centOffset: 0, timbre: 'santur', durationSec: 1.1, stepGapSec: 0.8, phaseName: 'فلات کهن ایران (سنتور)' },
      { midi: 69, centOffset: -45, timbre: 'santur', durationSec: 1.2, stepGapSec: 0.9, phaseName: 'فلات کهن ایران (فرود کُرن)' },
      { midi: 67, centOffset: 0, timbre: 'santur', durationSec: 2.2, stepGapSec: 1.7, phaseName: 'فلات کهن ایران (ایست کامل شور)' },

      // Phase 2: Anatolian Bridge - Setar & Bouzouki in Makam Ussak
      { midi: 67, centOffset: 0, timbre: 'setar', durationSec: 0.9, stepGapSec: 0.7, phaseName: 'پل شاهراه آناتولی (سه‌تار و تنبور)' },
      { midi: 69, centOffset: -22, timbre: 'bouzouki', durationSec: 0.8, stepGapSec: 0.6, phaseName: 'پل شاهراه آناتولی (کمای هولدرین)' },
      { midi: 70, centOffset: 0, timbre: 'setar', durationSec: 0.8, stepGapSec: 0.6, phaseName: 'پل شاهراه آناتولی (مقام اوشاک)' },
      { midi: 72, centOffset: 0, timbre: 'bouzouki', durationSec: 1.1, stepGapSec: 0.8, phaseName: 'پل شاهراه آناتولی (طنین بوزوکی)' },
      { midi: 74, centOffset: 0, timbre: 'bouzouki', durationSec: 1.3, stepGapSec: 1.0, phaseName: 'پل شاهراه آناتولی (گردش سماعی)' },
      { midi: 72, centOffset: 0, timbre: 'setar', durationSec: 0.9, stepGapSec: 0.7, phaseName: 'پل شاهراه آناتولی (سه‌تار)' },
      { midi: 69, centOffset: -22, timbre: 'bouzouki', durationSec: 1.0, stepGapSec: 0.8, phaseName: 'پل شاهراه آناتولی (کما)' },
      { midi: 67, centOffset: 0, timbre: 'setar', durationSec: 1.8, stepGapSec: 1.4, phaseName: 'پل شاهراه آناتولی (فرود آناتولی)' },

      // Phase 3: Danubian & Carpathian Basin - Țambal & Caval in Doina and lively Hora
      { midi: 67, centOffset: 0, timbre: 'caval', durationSec: 1.8, stepGapSec: 1.4, phaseName: 'حوضه کارپات-دانوب (سوز دوئینای رومانی با کاوال)' },
      { midi: 70, centOffset: 0, timbre: 'caval', durationSec: 1.4, stepGapSec: 1.1, phaseName: 'حوضه کارپات-دانوب (کاوال چوبی)' },
      { midi: 73, centOffset: 35, timbre: 'caval', durationSec: 1.6, stepGapSec: 1.2, phaseName: 'حوضه کارپات-دانوب (چهارم افزوده لیدیایی)' },
      { midi: 74, centOffset: 0, timbre: 'caval', durationSec: 1.9, stepGapSec: 1.4, phaseName: 'حوضه کارپات-دانوب (اوج دوئینا)' },
      // Hora burst with rapid virtuosic Țambal
      { midi: 74, centOffset: 0, timbre: 'tambal', durationSec: 0.45, stepGapSec: 0.35, phaseName: 'حوضه کارپات-دانوب (پایکوبی هورا با تسمبال)' },
      { midi: 72, centOffset: 0, timbre: 'tambal', durationSec: 0.45, stepGapSec: 0.35, phaseName: 'حوضه کارپات-دانوب (تسمبال لوتاری)' },
      { midi: 73, centOffset: 35, timbre: 'tambal', durationSec: 0.5, stepGapSec: 0.35, phaseName: 'حوضه کارپات-دانوب (تسمبال)' },
      { midi: 74, centOffset: 0, timbre: 'tambal', durationSec: 0.5, stepGapSec: 0.35, phaseName: 'حوضه کارپات-دانوب (تسمبال)' },
      { midi: 76, centOffset: 0, timbre: 'tambal', durationSec: 0.6, stepGapSec: 0.45, phaseName: 'حوضه کارپات-دانوب (مضراب‌های سریع)' },
      { midi: 74, centOffset: 0, timbre: 'tambal', durationSec: 0.45, stepGapSec: 0.35, phaseName: 'حوضه کارپات-دانوب (فرود هورا)' },
      { midi: 72, centOffset: 0, timbre: 'tambal', durationSec: 0.5, stepGapSec: 0.4, phaseName: 'حوضه کارپات-دانوب (تسمبال)' },
      { midi: 70, centOffset: 0, timbre: 'tambal', durationSec: 0.6, stepGapSec: 0.5, phaseName: 'حوضه کارپات-دانوب (فرود)' },
      { midi: 67, centOffset: 0, timbre: 'tambal', durationSec: 2.8, stepGapSec: 2.2, phaseName: 'حوضه کارپات-دانوب (طنین پایانی وحدت پیوستار)' }
    ];

    let accumulatedMs = 0;
    suiteSteps.forEach((step, idx) => {
      const tid = window.setTimeout(() => {
        this.playNote(step.midi, step.centOffset, step.timbre, 'glissando', step.durationSec);
        if (onPhaseChange) onPhaseChange(step.phaseName);

        if (idx === suiteSteps.length - 1 && onComplete) {
          const endTid = window.setTimeout(onComplete, Math.floor(step.durationSec * 1000 + 800));
          this.scheduledTimerIds.push(endTid);
        }
      }, accumulatedMs);

      this.scheduledTimerIds.push(tid);
      accumulatedMs += Math.floor(step.stepGapSec * 1000);
    });

    return () => this.stopAll();
  }

  /**
   * Play a Dastgah Daramad motif melody sequence
   */
  public playMotifMelody(
    melody: SequenceStep[],
    timbre: TimbreType = 'violin',
    tempoBpm = 110,
    onNoteTrigger?: (midi: number) => void,
    onComplete?: () => void
  ) {
    this.stopAll();
    this.initContext();

    const beatMs = (60 / tempoBpm) * 1000;
    let accumulatedTime = 0;

    melody.forEach((step, idx) => {
      const stepDurationMs = step.dur * beatMs;
      const tid = window.setTimeout(() => {
        this.playNote(step.midi, step.centOffset || 0, timbre, 'glissando', step.dur * (60 / tempoBpm) * 1.2);
        if (onNoteTrigger) onNoteTrigger(step.midi);

        if (idx === melody.length - 1 && onComplete) {
          const finishTid = window.setTimeout(onComplete, Math.floor(stepDurationMs + 600));
          this.scheduledTimerIds.push(finishTid);
        }
      }, accumulatedTime);

      this.scheduledTimerIds.push(tid);
      accumulatedTime += stepDurationMs;
    });
  }

  /**
   * Play a triad chord (I - III - V) simultaneously
   */
  public playTriadChord(midis: number[], timbre: TimbreType = 'piano') {
    this.initContext();
    midis.forEach((midi, idx) => {
      this.playNote(midi, 0, timbre, 'glissando', 2.0, idx * 0.02);
    });
  }

  /**
   * Play Continuum demonstration (calls the rich suite)
   */
  public playScaleDemonstration(
    scaleId: string,
    onNoteTriggerOrInstrument?: ((noteName: string) => void) | TimbreType,
    onComplete?: () => void
  ): () => void {
    const noteCb = typeof onNoteTriggerOrInstrument === 'function' ? onNoteTriggerOrInstrument : undefined;
    return this.playContinuumSuite((phase) => {
      if (noteCb) noteCb(phase);
    }, onComplete);
  }

  /**
   * Play single microtonal tone for legacy component
   */
  public playMicrotone(
    semitonesFromC4: number,
    centOffset = 0,
    instrumentType: TimbreType = 'santur',
    duration = 2.0
  ): { stop: () => void } {
    return this.playNote(60 + semitonesFromC4, centOffset, instrumentType, 'glissando', duration);
  }
}

export const audioEngine = new SynthesizerEngine();
