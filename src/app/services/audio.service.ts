import { Injectable } from '@angular/core';

import { Key } from '../keyboard/note-frequencies';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private customWaveform: PeriodicWave;

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.masterGainNode.gain.value = 0.5;

    const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    const cosineTerms = new Float32Array(sineTerms.length);
    this.customWaveform = this.audioContext.createPeriodicWave(
      cosineTerms,
      sineTerms
    );
  }

  play(key: Key) {
    const osc = this.audioContext.createOscillator();
    osc.connect(this.masterGainNode);

    osc.frequency.value = key.frequency;
    osc.start();
    return osc;
  }
}
