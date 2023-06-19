import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Point } from '../../types/point';
import { BehaviorSubject } from 'rxjs';
import { busRoutes } from '../../data/lines';

const camplusPos: Point = { longitude: 13.395538, latitude: 42.34656 };
const forteSpagnoloPos: Point = { longitude: 13.404768, latitude: 42.355627 };
@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class mapPage implements AfterViewInit, OnInit {
  map: mapboxgl.Map | undefined;
  location$: BehaviorSubject<Point>;

  constructor() {
    this.location$ = new BehaviorSubject(forteSpagnoloPos);
  }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.location$.value.longitude, this.location$.value.latitude],
      zoom: 14,
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.map) this.map.resize();
    }, 0);

    this.generateMarkers();
  }

  flyToLocation() {
    if (this.map) {
      this.map.flyTo({
        center: [this.location$.value.longitude, this.location$.value.latitude],
        zoom: 14,
      });
    }
  }

  adjustCamera() {
    if (this.map) {
      this.map.easeTo({
        pitch: 60,
        bearing: 180,
        duration: 1000,
        easing: (t: number) => t,
      });
    }
  }

  generateMarkers(): void {
    busRoutes.map((route) =>
      route.stops.map((stop) => {
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(../../assets/busStation.png)';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundSize = 'cover';

        new mapboxgl.Marker(el)
          .setLngLat([stop.point.longitude, stop.point.latitude])
          .addTo(this.map!);
      })
    );
  }
}
