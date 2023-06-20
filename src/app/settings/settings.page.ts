import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';

import { FavoriteServiceService } from '../favorite-service.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Stop } from '../../types/stop';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CustomHeaderComponent],
})
export class settingsPage {
  subscription: Subscription;
  favoriteStops = new BehaviorSubject<Stop[]>([]);

  constructor(private favoriteService: FavoriteServiceService) {
    this.subscription = this.favoriteService.currentFavoritesStops.subscribe(
      (stops) => this.favoriteStops.next(stops)
    );
  }

  deleteFavs() {
    console.log('delete Favorites was clicked');
    //here write your code navigate,event whatever you want
  }
}
