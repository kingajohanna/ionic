import { Component, OnInit, OnDestroy } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import { BehaviorSubject } from 'rxjs';
import { Stop } from '../../types/stop';
import { busRoutes } from '../../data/lines';
import { CommonModule } from '@angular/common';

import { FavoriteServiceService } from '../favorite-service.service';
import { Subscription } from 'rxjs';
import { getRouteAndDirection } from '../../calculations/getDirection';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  standalone: true,
  imports: [IonicModule, CustomHeaderComponent, CommonModule],
})
export class favoritesPage {
  subscription: Subscription;
  favoriteStops = new BehaviorSubject<Stop[]>([]);
  extendedInfo = new BehaviorSubject<
    { route: string; direction: string; stop: Stop }[]
  >([]);

  constructor(private favoriteService: FavoriteServiceService) {
    this.subscription = this.favoriteService.currentFavoritesStops.subscribe(
      (stops) => {
        if (stops.length == 0) this.favoriteStops.next([]);
        else this.favoriteStops.next(stops);

        let temp: any[] = [];
        stops.map((f) => {
          const info = getRouteAndDirection(f);

          temp.push({
            route: info?.route,
            direction: info?.direction,
            stop: f,
          });

          console.log(temp);
          this.extendedInfo.next(temp);
        });
      }
    );
  }
}
