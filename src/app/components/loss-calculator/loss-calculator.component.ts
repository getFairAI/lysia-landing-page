import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-loss-calculator',
  styleUrl: './loss-calculator.component.scss',
  templateUrl: './loss-calculator.component.html',
})
export class LossCalculatorComponent {
  teamSize = 20;
  wastedHours = 10;
  hourCost = 10;

  constructor(private translate: TranslateService) {}
}
