import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss'],
})
export class KeyComponent implements OnInit {
  @Input() key?: {
    octave: number;
    note: string;
    frequency: number;
  } | null;
  @Input() type: 'white' | 'black' = 'white';
  @Input() left: number = 0;

  constructor() {}

  ngOnInit() {}
}
