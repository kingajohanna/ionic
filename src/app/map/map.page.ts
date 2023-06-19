import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CustomHeaderComponent } from '../custom-header/custom-header.component'

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CustomHeaderComponent],
})
export class mapPage {
  constructor() {}
}
