import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component'

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CustomHeaderComponent],
})
export class settingsPage {
  constructor() { }

  deleteFavs() {
    console.log('delete Favorites was clicked')
    //here write your code navigate,event whatever you want
  }
}
