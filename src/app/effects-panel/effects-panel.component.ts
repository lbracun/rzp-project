import { Component, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-effects-panel',
  templateUrl: './effects-panel.component.html',
  styleUrls: ['./effects-panel.component.scss'],
})
export class EffectsPanelComponent implements OnInit {
  constructor(public audioService: AudioService) {}

  ngOnInit(): void {}
}
