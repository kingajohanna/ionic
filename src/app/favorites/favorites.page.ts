import { Component, OnInit, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import { BehaviorSubject } from 'rxjs';
import { Stop } from '../../types/stop';
import { busRoutes } from '../../data/lines';
import { CommonModule } from '@angular/common';

import { FavoriteServiceService } from "../favorite-service.service";
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

  message: string; //this is our test message
  subscription: Subscription; // this is our test Subscription object, what is it? what does it do?

  testStops = new BehaviorSubject<Stop[]>([]);

  stops$ = new BehaviorSubject<Stop[]>([]);

  constructor(private favoriteService: FavoriteServiceService) {
    this.stops$ = new BehaviorSubject(busRoutes[0].stops);

    this.testStops = new BehaviorSubject(busRoutes[0].stops);
    this.subscription = this.favoriteService.currentStops.subscribe(testStops => this.testStops = testStops)
    // why do we have different types here? ts dev pls help

    this.subscription = this.favoriteService.currentMessage.subscribe(message => this.message = message)
    console.log(this.message)
  } //we do not put the subscription update in the oninit lifecycle but in the constructor
   // so we stay uniform

  ionViewDidEnter() {
    console.log(this.message)
  }
}
