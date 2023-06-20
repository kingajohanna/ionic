import { Component, OnInit, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import { BehaviorSubject } from 'rxjs';
import { Stop } from '../../types/stop';
import { busRoutes } from '../../data/lines';
import { CommonModule } from '@angular/common';

import { FavoriteServiceService } from '../favorite-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ExploreContainerComponent,
    CustomHeaderComponent,
    CommonModule,
  ],
})
export class favoritesPage {
  subscription: Subscription;
  favoriteStops = new BehaviorSubject<Stop[]>([]);

  constructor(private favoriteService: FavoriteServiceService) {
    this.subscription = this.favoriteService.currentFavoritesStops.subscribe(
      (stops) => this.favoriteStops.next(stops)
    );
  }
}
