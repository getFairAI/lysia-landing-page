import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { YouTubePlayer } from '@angular/youtube-player';
import { CalendlyWidgetComponent } from '../components/calendly-widget/calendly-widget.component';
import { SafeHtmlPipe } from 'src/pipes/safeHtml.pipe';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CalendlyWidgetComponent, SafeHtmlPipe],
  imports: [MaterialModule, YouTubePlayer, DragScrollComponent, DragScrollItemDirective, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  providers: [provideAnimationsAsync(), MatDialog],
  exports: [MaterialModule, YouTubePlayer, CalendlyWidgetComponent, SafeHtmlPipe, DragScrollComponent, DragScrollItemDirective, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class SharedModule {}
