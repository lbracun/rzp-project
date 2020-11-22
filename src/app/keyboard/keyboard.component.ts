import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { NOTE_FREQUIENCIES } from './note-frequencies';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent implements OnInit {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  whiteKeys = NOTE_FREQUIENCIES.filter((key) => !key.note.includes('#'));
  blackKeys = this.constructBlackKeys();

  translateX = 3 * 7 * 68;

  constructor() {}

  ngOnInit() {}

  translateLeft() {
    this.translateX = Math.max(0, this.translateX - 7 * 68);
  }

  translateRight() {
    this.translateX = Math.min(
      this.translateX + 7 * 68,
      this.whiteKeys.length * 68 - window.innerWidth - 2
    );
  }

  private constructBlackKeys() {
    const bk = [];
    for (const key of NOTE_FREQUIENCIES.filter((key) =>
      key.note.includes('#')
    )) {
      bk.push(key);
      if (['A#', 'D#'].includes(key.note)) bk.push(null);
    }
    return bk;
  }
}
