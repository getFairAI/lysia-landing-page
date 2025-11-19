import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';
import { LandingComponent } from './views/landing/landing.component';
import { PrivacyComponent } from './views/privacy/privacy.component';

// // layouts
// import { AdminComponent } from './layouts/admin/admin.component';
// import { AuthComponent } from './layouts/auth/auth.component';

// // admin views
// import { DashboardComponent } from './views/admin/dashboard/dashboard.component';
// import { MapsComponent } from './views/admin/maps/maps.component';
// import { SettingsComponent } from './views/admin/settings/settings.component';
// import { TablesComponent } from './views/admin/tables/tables.component';

// // auth views
// import { LoginComponent } from './views/auth/login/login.component';
// import { RegisterComponent } from './views/auth/register/register.component';

// no layouts views
// import { IndexComponent } from './views/index/index.component';
// import { ProfileComponent } from './views/profile/profile.component';

const routes: Routes = [
  // admin views
  // {
  //   path: "admin",
  //   component: AdminComponent,
  //   children: [
  //     { path: "dashboard", component: DashboardComponent },
  //     { path: "settings", component: SettingsComponent },
  //     { path: "tables", component: TablesComponent },
  //     { path: "maps", component: MapsComponent },
  //     { path: "", redirectTo: "dashboard", pathMatch: "full" },
  //   ],
  // },
  // // auth views
  // {
  //   path: "auth",
  //   component: AuthComponent,
  //   children: [
  //     { path: "login", component: LoginComponent },
  //     { path: "register", component: RegisterComponent },
  //     { path: "", redirectTo: "login", pathMatch: "full" },
  //   ],
  // },
  // no layout views
  // { path: "profile", component: ProfileComponent },

  { path: '', component: LandingComponent },
  { path: 'privacy', component: PrivacyComponent },
  // { path: '', loadChildren: () => import('./views/landing/landing.module').then(m => m.LandingPageModule) },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
