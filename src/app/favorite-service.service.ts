import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { busRoutes } from '../data/lines';
import { Stop } from '../types/stop';

@Injectable({
  providedIn: 'root'
})
export class FavoriteServiceService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  private stopsSource = new BehaviorSubject<Stop[]>(busRoutes[0].stops); // this does still not work because I am not sure about the types
  currentStops = this.stopsSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changeStops(testStops: any) { //what types is stops exactly, for test purposes we will call them test stops
    this.messageSource.next(testStops)
  }
}
