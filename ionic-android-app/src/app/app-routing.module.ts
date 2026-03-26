import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding.page').then(m => m.OnboardingPage),
  },
  {
    path: 'paywall',
    loadComponent: () => import('./paywall/paywall.page').then(m => m.PaywallPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage),
  },
  {
    path: 'confession',
    loadComponent: () => import('./love/confession/confession.page').then(m => m.ConfessionPage),
  },
  {
    path: 'diaries/new',
    loadComponent: () => import('./love/diaries/diaries-new.page').then(m => m.DiariesNewPage),
  },
  {
    path: 'diaries/detail/:id',
    loadComponent: () => import('./love/diaries/diaries-detail.page').then(m => m.DiariesDetailPage),
  },
  {
    path: 'albums/detail/:id',
    loadComponent: () => import('./love/albums/albums-detail.page').then(m => m.AlbumsDetailPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'onboarding',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
