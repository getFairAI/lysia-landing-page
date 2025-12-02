import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-dashboard-page';
  isScrolled;

  supportedLangs = ['en', 'pt'];
  defaultLang = 'en';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = window.scrollY;

    if (number > 150) {
      this.isScrolled = true;
    } else if (this.isScrolled && number < 10) {
      this.isScrolled = false;
    }
  }

  constructor(private translate: TranslateService) {
    this.translate.addLangs(this.supportedLangs);

    const browserLang = this.detectBrowserLang();

    console.log(browserLang);
    if (browserLang === 'pt') {
      this.defaultLang = 'pt';
    } else {
      this.defaultLang = 'en';
    }
    this.translate.setDefaultLang(this.defaultLang);
    this.translate.use(this.defaultLang); // use the default
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

    // set first time isScrolled
    this.onWindowScroll();
  }

  private detectBrowserLang(): string {
    // e.g. ["pt-PT", "en-US", "fr-FR"]
    const navLanguages: string[] = (navigator.languages as string[]) || (navigator.language ? [navigator.language] : []);

    for (const lang of navLanguages) {
      const normalized = this.normalizeLang(lang);
      if (this.supportedLangs.includes(normalized)) {
        return normalized;
      }
    }

    // last fallback: try single navigator.language
    const single = this.normalizeLang(navigator.language || '');

    return single || this.defaultLang;
  }

  private normalizeLang(lang: string | undefined | null): string {
    if (!lang) return '';
    // "pt-PT" -> "pt", "en-US" -> "en"
    return lang.split('-')[0].toLowerCase();
  }
}
