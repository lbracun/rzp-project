import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fromEvent } from 'rxjs';

import { KeyComponent } from './key/key.component';
import { NOTES } from './notes';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent implements OnInit {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  whiteKeys = NOTES.filter((key) => !key.note.includes('#'));
  blackKeys = this.constructBlackKeys();

  translateX = 4 * 7 * 68;

  whiteKeyCodes = [
    { code: 'KeyZ', char: 'Y' },
    { code: 'KeyX', char: 'X' },
    { code: 'KeyC', char: 'C' },
    { code: 'KeyV', char: 'V' },
    { code: 'KeyB', char: 'B' },
    { code: 'KeyN', char: 'N' },
    { code: 'KeyM', char: 'M' },
    { code: 'Comma', char: ',' },
    { code: 'Period', char: '.' },
    { code: 'Slash', char: '-' },
    { code: 'KeyQ', char: 'Q' },
    { code: 'KeyW', char: 'W' },
    { code: 'KeyE', char: 'E' },
    { code: 'KeyR', char: 'R' },
    { code: 'KeyT', char: 'T' },
    { code: 'KeyY', char: 'Z' },
    { code: 'KeyU', char: 'U' },
    { code: 'KeyI', char: 'I' },
    { code: 'KeyO', char: 'O' },
    { code: 'KeyP', char: 'P' },
    { code: 'BracketLeft', char: 'Š' },
    { code: 'BracketRight', char: 'Đ' },
  ];

  blackKeyCodes = [
    { code: 'KeyS', char: 'S' },
    { code: 'KeyD', char: 'D' },
    null,
    { code: 'KeyG', char: 'G' },
    { code: 'KeyH', char: 'H' },
    { code: 'KeyJ', char: 'J' },
    null,
    { code: 'KeyL', char: 'L' },
    { code: 'Semicolon', char: 'Č' },
    null,
    { code: 'Digit2', char: '2' },
    { code: 'Digit3', char: '3' },
    { code: 'Digit4', char: '4' },
    null,
    { code: 'Digit6', char: '6' },
    { code: 'Digit7', char: '7' },
    null,
    { code: 'Digit9', char: '9' },
    { code: 'Digit0', char: '0' },
    { code: 'Minus', char: "'" },
  ];

  @ViewChildren(KeyComponent) private keyComponents?: QueryList<KeyComponent>;

  constructor() {}

  ngOnInit() {
    this.handleKeyPress();
  }

  translateLeft() {
    delete this._keys;
    this.translateX = Math.max(0, this.translateX - 7 * 68);
    setTimeout(() => {
      this._keys?.forEach((key) => key.liftUp());
      delete this._keys;
    }, 500);
  }

  translateRight() {
    const translateX = this.translateX + 7 * 68;
    if (translateX < this.whiteKeys.length * 68 - window.innerWidth - 2)
      this.translateX = translateX;
    setTimeout(() => {
      this._keys?.forEach((key) => key.liftUp());
      delete this._keys;
    }, 500);
  }

  private constructBlackKeys() {
    const bk = [];
    for (const key of NOTES.filter((key) => key.note.includes('#'))) {
      bk.push(key);
      if (['A#', 'D#'].includes(key.note)) bk.push(null);
    }
    return bk;
  }

  private handleKeyPress() {
    const getKeyComponent = (code: string) => {
      const whiteIndex = this.whiteKeyCodes
        .map(({ code }) => code)
        .indexOf(code);
      const blackIndex = this.blackKeyCodes
        .filter((x) => !!x)
        .map(({ code }: any) => code)
        .indexOf(code);

      if (whiteIndex > -1) {
        const whiteKeys = this.getKeys().filter((key) => key.type === 'white');
        return whiteKeys[whiteIndex];
      }
      if (blackIndex > -1) {
        const blackKeys = this.getKeys().filter((key) => key.type === 'black');
        return blackKeys[blackIndex];
      }

      return null;
    };

    const handleKey = (code: string, down: boolean) => {
      const key = getKeyComponent(code);
      if (down) key?.pressDown();
      else key?.liftUp();
    };

    fromEvent<KeyboardEvent>(document, 'keydown').subscribe((key) => {
      console.log(key.code);
      handleKey(key.code, true);
    });

    fromEvent<KeyboardEvent>(document, 'keyup').subscribe((key) => {
      handleKey(key.code, false);
    });
  }

  private _keys?: KeyComponent[];
  private getKeys() {
    if (!this.keyComponents) return [];
    if (!this._keys) {
      this._keys = this.keyComponents.filter((item) => {
        const child = item.elementRef.nativeElement.firstChild;
        if (child.getBoundingClientRect) {
          const { x } = child.getBoundingClientRect();
          return x >= 0 && x < window.innerWidth;
        }
        return false;
      });
    }
    return this._keys;
  }
}
