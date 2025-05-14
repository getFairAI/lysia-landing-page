import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { YouTubePlayer } from '@angular/youtube-player';
import { CalendlyWidgetComponent } from '../components/calendly-widget/calendly-widget.component';
import { SafeHtmlPipe } from 'src/pipes/safeHtml.pipe';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';

@NgModule({
  declarations: [CalendlyWidgetComponent, SafeHtmlPipe],
  imports: [MaterialModule, YouTubePlayer, DragScrollComponent, DragScrollItemDirective],
  providers: [provideAnimationsAsync()],
  exports: [MaterialModule, YouTubePlayer, CalendlyWidgetComponent, SafeHtmlPipe, DragScrollComponent, DragScrollItemDirective],
})
export class SharedModule {}
