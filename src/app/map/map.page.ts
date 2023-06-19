import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class mapPage implements AfterViewInit, OnInit {
  map: mapboxgl.Map | undefined;
  constructor() {}

  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.map) this.map.resize();
    }, 0);
  }

  flyToLocation() {
    if (this.map) {
      this.map.flyTo({
        center: [-73.985, 40.748817],
        zoom: 12,
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
}
