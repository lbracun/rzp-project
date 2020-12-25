import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { ControlsRowComponent } from './controls-row/controls-row.component';
import { EffectsPanelComponent } from './effects-panel/effects-panel.component';
import { HeaderComponent } from './header/header.component';
import { KeyComponent } from './keyboard/key/key.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { TracksComponent } from './tracks/tracks.component';

@NgModule({
  declarations: [
    AppComponent,
    KeyboardComponent,
    KeyComponent,
    HeaderComponent,
    TracksComponent,
    ControlsRowComponent,
    EffectsPanelComponent,
  ],
  imports: [
    BrowserModule,
    MatSliderModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
