import { Injectable } from '@angular/core';

import { Note } from '../keyboard/notes';

declare const MediaRecorder: any;

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private customWaveform: PeriodicWave;
  private oscilators = 0;

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
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
    this.masterGainNode.connect(mediaStream);
    return new MediaRecorder(mediaStream.stream);
  }

  //EFFECTS
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
      delete this.tremoloShaper;
      delete this.tremoloOsc;
    } else {
      this.addTremoloEffect();
    }
  }

  setTremoloValue(value: number | null) {
    if (this.tremoloOsc && value) this.tremoloOsc.frequency.value = value;
  }

  get tremolo() {
    return {
      enabled: !!this.tremoloShaper,
      value: this.tremoloOsc?.frequency.value,
    };
  }
}
