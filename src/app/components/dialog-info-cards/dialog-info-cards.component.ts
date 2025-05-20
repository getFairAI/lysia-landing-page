import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

export interface DialogData {
  infoCardId: string;
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
    }, 400);

    const currentLang = this.translateService.currentLang ?? 'en';
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
    // this.videoWidth = Math.min(this.youTubePlayer.nativeElement.clientWidth, 1200);

    // so you keep the ratio
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
