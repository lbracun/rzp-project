import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AudioService } from '../../services/audio.service';
import { Note } from '../notes';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss'],
})
export class KeyComponent implements OnInit {
  @Input() key?: Note | null;
  @Input() type: 'white' | 'black' = 'white';
  @Input() left: number = 0;

  pressed = false;

  private node?: OscillatorNode;

  constructor(
    public elementRef: ElementRef,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.handleMouseEvents();
  }

  pressDown() {
    if (this.pressed || !this.key) return;
    this.pressed = true;
    this.node = this.audioService.play(this.key);
  }

  liftUp() {
    if (!this.pressed) return;
    this.pressed = false;
    this.node?.stop();
  }

  private handleMouseEvents() {
    merge(
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseover').pipe(
        filter((evt) => evt.buttons === 1)
      ),
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown')
    ).subscribe(() => {
      this.pressDown();
    });

    merge(
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseleave'),
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseup')
    ).subscribe(() => {
      this.liftUp();
    });
  }
}
