import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
  animations: [
    trigger('someAnimation', [
      state('drag', style({ opacity: 0.5 })),
      transition(':enter', [
        animate(
          500,
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.25, offset: 0.25 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 0.75, offset: 0.75 }),
            style({ opacity: 1, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class LandingComponent {
  scrollRight() {
    let element = document.getElementById('scrollable-div');
    let currentScroll = element.clientWidth - element.offsetWidth;
    element.scrollLeft = currentScroll + element.clientWidth;
  }

  scrollLeft() {
    let element = document.getElementById('scrollable-div');
    let currentScroll = element.scrollWidth;
    element.scrollLeft = currentScroll - element.scrollWidth;
  }
}
