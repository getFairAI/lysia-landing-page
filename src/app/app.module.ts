import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import ngx-translate and the http loader
import { AuthNavbarComponent } from './components/navbars/auth-navbar/auth-navbar.component';
import { FooterComponent } from './components/footers/footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LandingComponent } from './views/landing/landing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogInfoCardsComponent } from './components/dialog-info-cards/dialog-info-cards.component';
import { TrustedByComponent } from './components/trusted-by/trusted-by.component';
import { PrivacyComponent } from './views/privacy/privacy.component';
import { CtaButtonComponent } from './components/cta-button/cta-button.component';
import { FeaturesComponent } from './components/features/features.component';
import { DatabasesIconSvgComponent } from './components/databases-icon/databases-icon.component';
import { HowToComponent } from './components/how-to/how-to.component';
import { DataImportIconComponent } from './components/data-import-icon/data-import-icon.component';
import { DataParsingIconComponent } from './components/data-parsing-icon/data-parsing-icon.component';
import { DashboardsIconComponent } from './components/dashboards-icon/dashboards-icon.component';
import { AiLearningIconComponent } from './components/ai-learning-icon/ai-learning-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthNavbarComponent,
    TrustedByComponent,
    FooterComponent,
    LandingComponent,
    PrivacyComponent,
    DialogInfoCardsComponent,
    CtaButtonComponent,
    FeaturesComponent,
    HowToComponent,
    // icons
    AiLearningIconComponent,
    DatabasesIconSvgComponent,
    DataImportIconComponent,
    DataParsingIconComponent,
    DashboardsIconComponent
    // DashboardComponent,
    // CardBarChartComponent,
    // CardLineChartComponent,
    // IndexDropdownComponent,
    // PagesDropdownComponent,
    // TableDropdownComponent,
    // NotificationDropdownComponent,
    // UserDropdownComponent,
    // SidebarComponent,
    // FooterSmallComponent,
    // FooterAdminComponent,
    // CardPageVisitsComponent,
    // CardProfileComponent,
    // CardSettingsComponent,
    // CardSocialTrafficComponent,
    // CardStatsComponent,
    // CardTableComponent,
    // HeaderStatsComponent,
    // MapExampleComponent,
    // IndexNavbarComponent,
    // AdminComponent,
    // AuthComponent,
    // MapsComponent,
    // SettingsComponent,
    // TablesComponent,
    // LoginComponent,
    // RegisterComponent,
    // IndexComponent,
    // ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
        },
    }),
],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}
