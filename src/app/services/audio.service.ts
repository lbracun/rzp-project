import { Injectable } from '@angular/core';

import { Note } from '../keyboard/notes';

declare const MediaRecorder: any;

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private finalNode: GainNode;
  private customWaveform: PeriodicWave;
  private oscilators = 0;

  constructor() {
    this.audioContext = new AudioContext();
    this.finalNode = this.audioContext.createGain();
    this.finalNode.connect(this.audioContext.destination);

    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.finalNode);
    this.masterGainNode.gain.value = 1;

    const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    const cosineTerms = new Float32Array(sineTerms.length);
    this.customWaveform = this.audioContext.createPeriodicWave(
      cosineTerms,
      sineTerms
    );
  }

  play(key: Note) {
    const osc = this.audioContext.createOscillator();
    this.oscilators++;
    this.updateGain();
    osc.onended = () => {
      this.oscilators--;
      osc.disconnect();
      this.updateGain();
    };
    osc.setPeriodicWave(this.customWaveform);
    osc.connect(this.masterGainNode);

    const frequency = Math.pow(2, (key.number - 69) / 12) * 440;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    osc.start();
    return osc;
  }

  private updateGain() {
    this.masterGainNode.gain.value = 1 / (this.oscilators || 1);
  }

  getRecorder() {
    const mediaStream = this.audioContext.createMediaStreamDestination();
    this.finalNode.connect(mediaStream);
    return new MediaRecorder(mediaStream.stream);
  }

  // EFFECTS:
  // TREMOLO
  private tremoloShaper?: WaveShaperNode;
  private tremoloOsc?: OscillatorNode;

  private addTremoloEffect() {
    this.tremoloShaper = this.audioContext.createWaveShaper();
    this.tremoloShaper.curve = new Float32Array([0, 1]);
    this.tremoloShaper.connect(this.masterGainNode);

    this.tremoloOsc = this.audioContext.createOscillator();
    this.tremoloOsc.frequency.value = 5;
    this.tremoloOsc.type = 'sine';
    this.tremoloOsc.start();
    this.tremoloOsc.connect(this.tremoloShaper);
  }

  toggleTremolo() {
    if (this.tremoloShaper) {
      this.tremoloShaper.disconnect();
      this.tremoloOsc?.disconnect();
      delete this.tremoloShaper;
      delete this.tremoloOsc;
    } else {
      this.addTremoloEffect();
    }
  }

  setTremoloValue(value: number | null) {
    if (this.tremoloOsc && value !== null)
      this.tremoloOsc.frequency.value = value;
  }

  get tremolo() {
    return {
      enabled: !!this.tremoloShaper,
      value: this.tremoloOsc?.frequency.value,
    };
  }

  // OVERDRIVE:
  private overdriveShaper?: WaveShaperNode;
  private overdriveGain?: GainNode;

  private addOverdriveEffect() {
    this.overdriveShaper = this.audioContext.createWaveShaper();
    this.overdriveShaper.curve = new Float32Array([-1, 1]);

    this.overdriveGain = this.audioContext.createGain();
    this.overdriveGain.gain.value = 10;
    this.masterGainNode.connect(this.overdriveGain);
    this.overdriveGain.connect(this.overdriveShaper);
    this.overdriveShaper.connect(this.finalNode);
  }

  toggleOverdrive() {
    if (this.overdriveShaper) {
      this.overdriveShaper.disconnect();
      this.overdriveGain?.disconnect();
      delete this.overdriveGain;
      delete this.overdriveShaper;
    } else {
      this.addOverdriveEffect();
    }
  }

  setOverdriveGain(value: number | null) {
    if (this.overdriveGain && value !== null)
      this.overdriveGain.gain.value = value;
  }

  get overdrive() {
    return {
      enabled: !!this.overdriveGain,
      value: this.overdriveGain?.gain.value,
    };
  }

  // NOISE CONVOLVER:
  private convolver?: ConvolverNode;

  private setNoiseBuffer(noiseBuffer: AudioBuffer) {
    if (!this.convolver) return;

    const left = noiseBuffer.getChannelData(0);
    const right = noiseBuffer.getChannelData(1);

    for (var i = 0; i < noiseBuffer.length; i++) {
      left[i] = Math.random() * 2 - 1;
      right[i] = Math.random() * 2 - 1;
    }
    this.convolver.buffer = noiseBuffer;
  }

  private addConvolverEffect() {
    this.convolver = this.audioContext.createConvolver();
    this.setNoiseBuffer(
      this.audioContext.createBuffer(
        2,
        0.5 * this.audioContext.sampleRate,
        this.audioContext.sampleRate
      )
    );

    this.masterGainNode.connect(this.convolver);
    this.convolver.connect(this.finalNode);
  }

  toggleConvolver() {
    if (this.convolver) {
      this.convolver.disconnect();
      delete this.convolver;
    } else {
      this.addConvolverEffect();
    }
  }

  setConvolver(value: number | null) {
    if (value !== null)
      this.setNoiseBuffer(
        this.audioContext.createBuffer(
          2,
          value * this.audioContext.sampleRate,
          this.audioContext.sampleRate
        )
      );
  }

  get noiseConvolver() {
    return {
      enabled: !!this.convolver,
      value:
        (this.convolver?.buffer?.length || 0) / this.audioContext.sampleRate,
    };
  }
}
