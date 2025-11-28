import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  infoCardId: string;
}

declare global {
  interface Window {
    plausible: (eventName: string, { callback, props, revenue }: { callback?: () => void, props?: any, revenue?: any}) => void;
  }
}

@Component({
  selector: 'app-dialog-info-cards',
  templateUrl: './dialog-info-cards.component.html',
  styleUrl: './dialog-info-cards.component.scss',
})
export class DialogInfoCardsComponent implements OnInit, AfterViewInit {
  currentCardDataFromTranslate: any[] = new Array(); // array containing all the cards data to show on popup

  videoHeight: number | undefined;
  videoWidth: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogInfoCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // scroll to the top - avoids a bug when a video is present (?)
    let topDiv = document.getElementById('card-content-div');
    setTimeout(() => {
      topDiv?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }, 300);

    const currentLang = this.translateService.currentLang ?? 'pt';
    const currentLangData = this.translateService.translations[currentLang];

    this.currentCardDataFromTranslate = currentLangData?.CARDS[this.data.infoCardId]?.INNER_CARDS ?? [];
  }

  ngAfterViewInit(): void {
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  @ViewChild('youTubePlayer') youTubePlayer: ElementRef<HTMLDivElement>;
  onResize(): void {
    // you can remove this line if you want to have wider video player than 1200px
    this.videoWidth = Math.min(this.youTubePlayer.nativeElement.clientWidth, 1200);

    // so you keep the ratio
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleEvent(): void {}

  videoStateChange(event: YT.OnStateChangeEvent): void {
    // make sure plausible is available
    if (window.plausible) {
      const video = event.target.getVideoUrl();
      const time = event.target.getCurrentTime();
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          // emit play event
          if (time < 1) {
            window.plausible('Video Start', { callback: this.handleEvent, props: { video, } })
          } else {
            window.plausible('Video Resumed or Skipped', { callback: this.handleEvent, props: { video, time } })
          }

          break;
        case YT.PlayerState.PAUSED:
          // emit paused event
          // emit when stopped
          window.plausible('Video Paused', { callback: this.handleEvent, props: { video, time } })
          break;
        case YT.PlayerState.ENDED:
          // emit finished video event
          window.plausible('Video Finished', { callback: this.handleEvent, props: { video } })
          break;
        default:
          return;
      }
    }
  }
}
