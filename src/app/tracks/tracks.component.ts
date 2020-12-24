import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
})
export class TracksComponent implements OnInit, OnDestroy {
  tracks: Array<{
    selected: boolean;
    audio?: HTMLAudioElement;
  }> = [{ selected: true, audio: undefined }];

  private destroy$ = new Subject();

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {
    this.sharedDataService.recordingComplete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (audio) => {
        while (!isFinite(audio.duration)) {
          audio.currentTime = 9999999;
          await new Promise((r) => setTimeout(r, 100));
        }

        audio.currentTime = 0;

        const selectedTrack = this.tracks.find((t) => t.selected);
        if (selectedTrack) selectedTrack.audio = audio;

        console.log(audio);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNewTrack() {
    this.tracks.forEach((t) => {
      t.selected = false;
    });
    this.tracks.push({
      selected: true,
    });
  }

  select(track: any) {
    this.tracks.forEach((t) => {
      t.selected = false;
    });

    track.selected = true;
  }
}
