import { Component, Inject } from '@angular/core';
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
export class DialogInfoCardsComponent {
  currentCardDataFromTranslate: any[] = new Array(); // array containing all the cards data to show on popup

  constructor(public dialogRef: MatDialogRef<DialogInfoCardsComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private translateService: TranslateService) {}

  ngOnInit(): void {
    const currentLang = this.translateService.currentLang ?? 'en';
    const currentLangData = this.translateService.translations[currentLang];

    this.currentCardDataFromTranslate = currentLangData?.CARDS[this.data.infoCardId]?.INNER_CARDS ?? [];

    // this.translateService.onLangChange.subscribe({
    //   next: (newLangData: TranslationChangeEvent) => {
    //     this.videoCardsUrls.card1 = newLangData.translations?.CARDS?.CARD1?.VIDEO_URL ?? '';
    //     this.videoCardsUrls.card2 = newLangData.translations?.CARDS?.CARD2?.VIDEO_URL ?? '';
    //     this.videoCardsUrls.card3 = newLangData.translations?.CARDS?.CARD3?.VIDEO_URL ?? '';
    //     this.videoCardsUrls.card4 = newLangData.translations?.CARDS?.CARD4?.VIDEO_URL ?? '';
    //     this.videoCardsUrls.card5 = newLangData.translations?.CARDS?.CARD5?.VIDEO_URL ?? '';
    //   },
    //   error: error => {
    //     console.log(error);
    //   },
    // });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
