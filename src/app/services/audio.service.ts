import { Injectable } from '@angular/core';

import { Note } from '../keyboard/notes';

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
}
