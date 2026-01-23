import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { CalendlyWidgetComponent } from '../components/calendly-widget/calendly-widget.component';
import { SafeHtmlPipe } from 'src/pipes/safeHtml.pipe';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@NgModule({
  declarations: [CalendlyWidgetComponent, SafeHtmlPipe],
  imports: [FormsModule, MatProgressSpinnerModule, MatIconModule, MatSliderModule, CdkAccordionModule],
  providers: [provideAnimationsAsync()],
  exports: [CalendlyWidgetComponent, SafeHtmlPipe, FormsModule, MatProgressSpinnerModule, MatIconModule, MatSliderModule, CdkAccordionModule],
})
export class SharedModule {}
