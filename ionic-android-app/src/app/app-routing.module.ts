import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
    path: 'diaries/edit/:id',
    loadComponent: () => import('./love/diaries/diaries-edit.page').then(m => m.DiariesEditPage),
  },
  {
    path: 'albums/detail/:id',
    loadComponent: () => import('./love/albums/albums-detail.page').then(m => m.AlbumsDetailPage),
  },
  {
    path: 'milestones/new',
    loadComponent: () => import('./love/milestones/milestones-new.page').then(m => m.MilestonesNewPage),
  },
  {
    path: 'milestones/detail/:id',
    loadComponent: () => import('./love/milestones/milestones-detail.page').then(m => m.MilestonesDetailPage),
  },
  {
    path: 'milestones/edit/:id',
    loadComponent: () => import('./love/milestones/milestones-edit.page').then(m => m.MilestonesEditPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'tabs/home',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
