import { Component, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-controls-row',
  templateUrl: './controls-row.component.html',
  styleUrls: ['./controls-row.component.scss'],
})
export class ControlsRowComponent implements OnInit {
  recording = false;
  effectsPanel = false;

  private recorder: any;

  constructor(
    private audioService: AudioService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {}

  toggleRecording() {
    if (!this.recording) {
      this.recorder = this.audioService.getRecorder();
      this.recorder.start();
    } else {
      this.recorder.addEventListener('dataavailable', (e: any) => {
        const audio = new Audio(URL.createObjectURL(e.data));

        this.sharedDataService.recordingComplete$.next(audio);
        delete this.recorder;
      });
      this.recorder.stop();
    }

    this.recording = !this.recording;
  }

  play() {
    this.sharedDataService.play$.next();
  }

  toggleEffectsPanel() {
    this.effectsPanel = !this.effectsPanel;
  }
}
