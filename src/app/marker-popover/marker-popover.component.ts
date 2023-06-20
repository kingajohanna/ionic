import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Stop } from '../../types/stop';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FavoriteServiceService } from '../favorite-service.service';

@Component({
  selector: 'app-marker-popover',
  templateUrl: './marker-popover.component.html',
  styleUrls: ['./marker-popover.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MarkerPopoverComponent {
  @Input() stop: Stop;
  @Input() isFav: boolean;
  @Input() onClickCallback: (
    stop: Stop,
    isFav: boolean,
    favoriteService: FavoriteServiceService
  ) => void;
  @Input() favoriteService: FavoriteServiceService;

  constructor(private popoverController: PopoverController) {}

  closePopover(): void {
    this.popoverController.dismiss();
  }

  onClick(): void {
    this.onClickCallback(this.stop, this.isFav, this.favoriteService);
    this.popoverController.dismiss();
  }
}
