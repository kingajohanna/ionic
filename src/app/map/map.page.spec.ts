import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mapPage } from './map.page';

describe('mapPage', () => {
  let component: mapPage;
  let fixture: ComponentFixture<mapPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [mapPage],
    }).compileComponents();

    fixture = TestBed.createComponent(mapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
