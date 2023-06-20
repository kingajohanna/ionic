import { Component } from '@angular/core';
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



  constructor() { }

  

}
