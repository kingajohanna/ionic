import { ComponentFixture, TestBed } from '@angular/core/testing';

import { settingsPage } from './settings.page';

describe('settingsPage', () => {
  let component: settingsPage;
  let fixture: ComponentFixture<settingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [settingsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(settingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
