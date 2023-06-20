import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { busRoutes } from '../data/lines';
import { Stop } from '../types/stop';

@Injectable({
  providedIn: 'root',
})
export class FavoriteServiceService {
  private favoriteStops = new BehaviorSubject<Stop[]>([
    busRoutes[0].stops[0],
    busRoutes[0].stops[1],
  ]); // this does still not work because I am not sure about the types
  currentFavoritesStops = this.favoriteStops.asObservable();

  constructor() {}

  changeStops(newFavoriteStops: Stop[]) {
    this.favoriteStops.next(newFavoriteStops);
  }

  addOneStop(newFavoriteStop: Stop) {
    const temp = [...this.favoriteStops.value, newFavoriteStop]; //... operator is used for merging fields and values of objects, second object has precedence

    this.favoriteStops.next(temp);
  }

  deleteOneStop(favoriteStopToBeDeleted: Stop) {
    const temp = this.favoriteStops.value.filter(
      (stop) => stop.name !== favoriteStopToBeDeleted.name
    );
    this.favoriteStops.next(temp);
  }

  deleteAllStops() {
    this.favoriteStops.next([]);
  }

  isFavorite(stopFav: Stop) {
    const temp = this.favoriteStops.value.filter((stop) => {
      console.log(stop.name === stopFav.name, stop.name, stopFav.name);

      stop.name === stopFav.name;
    });
    console.log('**', temp.length);

    return temp.length;
  }
}
