import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-dashboard-page';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['pt', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // use the default
  }

  ngOnInit(): void {
    const lastUsedLang = localStorage.getItem('languageSelected');
    // if user has selected a language before, restore it
    if (lastUsedLang === 'en' || lastUsedLang === 'pt') {
      this.translate.use(lastUsedLang);
    }
  }

  ngAfterViewInit(): void {
    // subscribe to language changes to save them to localStorage
    // this subscribe fires right at the first run
    this.translate.onLangChange.subscribe(newLanguageData => {
      localStorage.setItem('languageSelected', newLanguageData.lang ?? 'en');
    });
  }
}
