import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
  standalone: true,
  imports: [IonicModule],
})


export class CustomHeaderComponent implements OnInit {

  constructor() { }

  public title: string = ''

  ngOnInit() {}

}

