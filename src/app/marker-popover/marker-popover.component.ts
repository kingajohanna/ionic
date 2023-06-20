import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Stop } from '../../types/stop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marker-popover',
  templateUrl: './marker-popover.component.html',
  styleUrls: ['./marker-popover.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MarkerPopoverComponent {
  @Input() stop: Stop;

  constructor(private popoverController: PopoverController) {}

  closePopover(): void {
    this.popoverController.dismiss();
  }

  onClick(): void {
    console.log('szar');
  }
}
