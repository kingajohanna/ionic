import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Point } from '../../types/point';
import { BehaviorSubject } from 'rxjs';
import { busRoutes } from '../../data/lines';

import { Route } from '../../types/route';
import { getRouteDirection } from '../../calculations/getRouteDirection';

const latitudeThreshold = 0.0003;
const longitudeThreshold = 0.0003;

const camplusPos: Point = { longitude: 13.395538, latitude: 42.34656 };
const forteSpagnoloPos: Point = { longitude: 13.404768, latitude: 42.355627 };
@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CustomHeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class mapPage implements AfterViewInit, OnInit {
  map: mapboxgl.Map;
  location$: BehaviorSubject<Point>;
  destination$: BehaviorSubject<Point>;
  destinationMarker: mapboxgl.Marker;
  locationMarker: mapboxgl.Marker;
  route$: BehaviorSubject<Route>;

  constructor() {}

  ngOnInit() {
    this.location$ = new BehaviorSubject(forteSpagnoloPos);
    this.destination$ = new BehaviorSubject(forteSpagnoloPos);
    this.route$ = new BehaviorSubject({
      beforeBus: [],
      onBus: [],
      afterBus: [],
    } as Route);

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
      if (this.map.getLayer('beforebusLayer')) {
        this.map.removeLayer('beforebusLayer');
        this.map.removeSource('beforebus');
      }

      this.map.addSource('beforebus', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.beforeBus,
          },
        },
      });

      this.map.addLayer({
        id: 'beforebusLayer',
        type: 'line',
        source: 'beforebus',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 8,
        },
      });
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
      } else {
        const route = await getRouteDirection(
          self.location$.value,
          self.destination$.value
        );
        console.log('plan', route);

        self.route$.next(route);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.map.resize();
    }, 0);

    this.generateMarkers();
  }

  flyToLocation() {
    this.map.flyTo({
      center: [this.location$.value.longitude, this.location$.value.latitude],
      zoom: 15,
    });
  }

  adjustCamera() {
    this.map.easeTo({
      pitch: 60,
      bearing: 180,
      duration: 1000,
      easing: (t: number) => t,
    });
  }

  generateMarkers(): void {
    busRoutes.map((route) =>
      route.stops.map((stop) => {
        this.addMarker(
          [stop.point.longitude, stop.point.latitude],
          'url(../../assets/busStation.png)'
        );
      })
    );
  }

  /** 
          let markers: any[] = [];
    busRoutes.map((route) => {
      const stops = route.stops.map((stop) => ({
        stop,
      }));
      markers = [...markers, ...stops];
    });
    this.busMarkers = markers;
        ); */

  addMarker(point: mapboxgl.LngLatLike, icon: string): void {
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = icon;
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.backgroundSize = 'cover';

    new mapboxgl.Marker(el).setLngLat(point).addTo(this.map!);
  }
}
