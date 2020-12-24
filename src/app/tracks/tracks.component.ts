import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
})
export class TracksComponent implements OnInit {
  tracks = [{ selected: true }, { selected: false }];

  constructor() {}

  ngOnInit(): void {}

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
