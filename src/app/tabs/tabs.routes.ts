import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'favorites',
        loadComponent: () =>
          import('../favorites/favorites.page').then((m) => m.favoritesPage),
      },
      {
        path: 'map',
        loadComponent: () => import('../map/map.page').then((m) => m.mapPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.settingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/map',
    pathMatch: 'full',
  },
];
