import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { busRoutes } from '../data/lines';
import { Stop } from '../types/stop';

@Injectable({
  providedIn: 'root',
})
export class FavoriteServiceService {
  private favoriteStops = new BehaviorSubject<Stop[]>(busRoutes[0].stops); // this does still not work because I am not sure about the types
  currentFavoritesStops = this.favoriteStops.asObservable();

  constructor() {}

  changeStops(newFavoriteStops: Stop[]) {
    this.favoriteStops.next(newFavoriteStops);
  }
}
