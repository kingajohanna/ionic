import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { busRoutes } from '../data/lines';
import { Stop } from '../types/stop';
import { getRouteAndDirection } from '../calculations/getDirection';

@Injectable({
  providedIn: 'root',
})
export class FavoriteServiceService {
  private favoriteStops = new BehaviorSubject<Stop[]>([]); // this does still not work because I am not sure about the types
  currentFavoritesStops = this.favoriteStops.asObservable();
  private localStorageKey = 'favoriteStops';

  constructor() {
    this.loadFavoriteStopsFromLocalStorage();
  }

  changeStops(newFavoriteStops: Stop[]) {
    this.favoriteStops.next(newFavoriteStops);
    this.saveFavoriteStopsToLocalStorage(newFavoriteStops);
  }

  addOneStop(newFavoriteStop: Stop) {
    const temp = [...this.favoriteStops.value, newFavoriteStop]; //... operator is used for merging fields and values of objects, second object has precedence
    this.favoriteStops.next(temp);
    this.saveFavoriteStopsToLocalStorage(temp);
  }

  deleteOneStop(favoriteStopToBeDeleted: Stop) {
    const temp = this.favoriteStops.value.filter(
      (stop) => stop.name !== favoriteStopToBeDeleted.name
    );
    this.favoriteStops.next(temp);
    this.saveFavoriteStopsToLocalStorage(temp);
  }

  deleteAllStops() {
    this.favoriteStops.next([]);
    this.saveFavoriteStopsToLocalStorage([]);
  }

  isFavorite(stopFav: Stop) {
    const temp = this.favoriteStops.value.filter(
      (stop) => stop.name === stopFav.name
    );
    return temp.length;
  }

  private loadFavoriteStopsFromLocalStorage() {
    const cachedStops = localStorage.getItem(this.localStorageKey);
    if (cachedStops) {
      const favoriteStops = JSON.parse(cachedStops) as Stop[];
      this.favoriteStops.next(favoriteStops);
    }
  }

  private saveFavoriteStopsToLocalStorage(favoriteStops: Stop[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(favoriteStops));
  }
}
