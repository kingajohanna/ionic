import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component'

import { FavoriteServiceService } from "../favorite-service.service";
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CustomHeaderComponent],
})
export class settingsPage {

  message: string;
  subscription: Subscription;


  constructor(private favoriteService: FavoriteServiceService) {
    this.subscription = this.favoriteService.currentMessage.subscribe(message => this.message = message)
    console.log(this.message)
  }

  deleteFavs() {
    console.log('delete Favorites was clicked')
    //here write your code navigate,event whatever you want
    
    this.favoriteService.changeMessage("Hello from Sibling")
  }

  ionViewDidEnter() {
    console.log(this.message)
  }
}
