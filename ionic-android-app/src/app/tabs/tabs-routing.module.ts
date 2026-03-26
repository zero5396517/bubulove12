import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../love/home/home.page').then(m => m.LoveHomePage),
      },
      {
        path: 'diaries',
        loadComponent: () => import('../love/diaries/diaries-list.page').then(m => m.DiariesListPage),
      },
      {
        path: 'albums',
        loadComponent: () => import('../love/albums/albums-list.page').then(m => m.AlbumsListPage),
      },
      {
        path: 'milestones',
        loadComponent: () => import('../love/milestones/milestones-timeline.page').then(m => m.MilestonesTimelinePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
