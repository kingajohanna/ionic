import { Component } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component'



@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CustomHeaderComponent],
})

export class favoritesPage {
  stops: any[];

  constructor(private http: HttpClient) {
    this.stops = [];
  }

  ionViewDidEnter() {
    this.http.get<any[]>('/assets/lines/line1.json').subscribe(data => {
      this.stops = data.slice(0, 2);

      this.http.get<any[]>('/assets/lines/line1.json').subscribe(dataline2 => {
        this.stops = this.stops.concat(dataline2.slice(0, 2)); 
      });

    });

  }  

}
