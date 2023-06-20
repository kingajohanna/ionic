import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
} from '@angular/core';
import {
  InputChangeEventDetail,
  IonicModule,
  PopoverController,
} from '@ionic/angular';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Point } from '../../types/point';
import { BehaviorSubject } from 'rxjs';
import { busRoutes } from '../../data/lines';
import { Route } from '../../types/route';
import { getRouteDirection } from '../../calculations/getRouteDirection';
import { Stop } from '../../types/stop';
import { FavoriteServiceService } from '../favorite-service.service';
import { Subscription } from 'rxjs';
import axios from 'axios';
import { Place } from '../../types/place';
import { CommonModule } from '@angular/common';
import { MarkerPopoverComponent } from '../marker-popover/marker-popover.component';

const latitudeThreshold = 0.0003;
const longitudeThreshold = 0.0003;

const camplusPos: Point = { longitude: 13.395538, latitude: 42.34656 };
const forteSpagnoloPos: Point = { longitude: 13.404768, latitude: 42.355627 };
@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [IonicModule, CustomHeaderComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class mapPage implements AfterViewInit, OnInit {
  map: mapboxgl.Map;
  destinationMarker: mapboxgl.Marker;
  locationMarker: mapboxgl.Marker;

  location$ = new BehaviorSubject<Point>(forteSpagnoloPos);
  destination$ = new BehaviorSubject<Point>(forteSpagnoloPos);
  route$ = new BehaviorSubject({
    beforeBus: [],
    onBus: [],
    afterBus: [],
  } as Route);
  searchAdresses$ = new BehaviorSubject<Place[]>([]);
  selectedAddress$ = new BehaviorSubject<Place>({} as Place);

  subscription: Subscription;
  favoriteStops = new BehaviorSubject<Stop[]>([]);
  markers: mapboxgl.Marker[] = [];

  constructor(
    private favoriteService: FavoriteServiceService,
    private popoverController: PopoverController
  ) {
    this.subscription = this.favoriteService.currentFavoritesStops.subscribe(
      (stops) => {
        this.favoriteStops.next(stops);
        this.redrawMarkers();
      }
    );
  }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.location$.value.longitude, this.location$.value.latitude],
      zoom: 15,
    });

    this.destination$.subscribe((destination) => {
      if (this.destinationMarker) {
        this.destinationMarker.setLngLat([
          destination.longitude,
          destination.latitude,
        ]);
      } else {
        this.destinationMarker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([destination.longitude, destination.latitude])
          .addTo(this.map);
      }
    });

    this.location$.subscribe((location) => {
      if (this.locationMarker) {
        this.locationMarker.setLngLat([location.longitude, location.latitude]);
      } else {
        this.locationMarker = new mapboxgl.Marker()
          .setLngLat([location.longitude, location.latitude])
          .addTo(this.map);
      }
    });

    this.route$.subscribe((route) => {
      this.generateRoutePlanning(route.beforeBus, 'beforeBus', '#92949c');
      this.generateRoutePlanning(route.onBus, 'onBus', '#5260ff');
      this.generateRoutePlanning(route.afterBus, 'afterBus', '#92949c');
    });

    const self = this;

    this.map.on('click', async function (e) {
      if (
        Math.abs(self.destination$.value.latitude - e.lngLat.lat) >
          latitudeThreshold ||
        Math.abs(self.destination$.value.longitude - e.lngLat.lng) >
          longitudeThreshold
      ) {
        self.destination$.next({
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat,
        });
        self.route$.next({
          beforeBus: [],
          onBus: [],
          afterBus: [],
        } as Route);
        self.selectedAddress$.next({} as Place);
      } else {
        const route = await getRouteDirection(
          self.location$.value,
          self.destination$.value
        );

        self.route$.next(route);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.map.resize();
      this.generateMarkers();
    }, 0);
  }

  flyToLocation(location: Point) {
    this.map.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 15,
    });
  }

  generateMarkers(): void {
    busRoutes.map((route) =>
      route.stops.map((stop) => {
        this.addMarker(stop, 'url(../../assets/busStation.png)');
      })
    );
  }

  generateRoutePlanning(data: any[], id: string, color: string): void {
    if (this.map.getLayer(id)) {
      this.map.removeLayer(id);
      this.map.removeSource(id);
    }

    this.map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: data,
        },
      },
    });

    this.map.addLayer({
      id: id,
      type: 'line',
      source: id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': color,
        'line-width': 8,
      },
    });
  }

  manageFav(stop: Stop) {
    console.log('szae');

    const isFav = this.favoriteService.isFavorite(stop);

    if (isFav) this.favoriteService.deleteOneStop(stop);
    else this.favoriteService.addOneStop(stop);

    this.redrawMarkers();
  }

  addMarker(stop: Stop, icon: string): void {
    const isFav = this.favoriteService.isFavorite(stop);

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<ion-label>
        <h2>${stop.name}</h2>
        <p>Times</p>
        <p>${stop.times.join(', ')}</p>
      </ion-label>
      <ion-button color="light" id="markerButton">
        ${
          isFav
            ? '<ion-icon slot="icon-only" name="heart" color="danger"></ion-icon> '
            : '<ion-icon slot="icon-only" name="heart-outline" color="danger"></ion-icon>'
        }
      </ion-button>
      `);

    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = icon;
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.backgroundSize = 'cover';

    const marker = new mapboxgl.Marker(el)
      .setLngLat([stop.point.longitude, stop.point.latitude])
      .addTo(this.map!);

    marker.getElement().addEventListener('click', async () => {
      const popover = await this.popoverController.create({
        component: MarkerPopoverComponent,
        componentProps: {
          stop: stop,
        },
      });
      await popover.present();
    });

    this.markers.push(marker);
  }

  redrawMarkers(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
    this.generateMarkers();
  }

  async search(event: any) {
    const value = event.detail.value || '';
    if (value)
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?proximity=ip&access_token=${environment.mapbox.accessToken}`
        )
        .then((res) => {
          const extractedData = res.data.features.map((feature: any) => {
            const { text, place_name, center } = feature;
            return { text, place_name, center } as Place;
          });

          this.searchAdresses$.next(extractedData);
        });
  }

  onSelect(address: Place) {
    const point = {
      longitude: address.center[0],
      latitude: address.center[1],
    };
    this.selectedAddress$.next(address);
    this.searchAdresses$.next([]);
    this.destination$.next(point);
    this.route$.next({
      beforeBus: [],
      onBus: [],
      afterBus: [],
    } as Route);
    this.flyToLocation(point);
  }
}
