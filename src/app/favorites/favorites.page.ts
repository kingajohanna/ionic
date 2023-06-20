import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import { BehaviorSubject } from 'rxjs';
import { Stop } from '../../types/stop';
import { busRoutes } from '../../data/lines';
import { CommonModule } from '@angular/common';

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
  stops$ = new BehaviorSubject<Stop[]>([]);

  constructor() {
    this.stops$ = new BehaviorSubject(busRoutes[0].stops);
  }

  ionViewDidEnter() {}
}
