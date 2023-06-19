import { ComponentFixture, TestBed } from '@angular/core/testing';

import { favoritesPage } from './favorites.page';

describe('favoritesPage', () => {
  let component: favoritesPage;
  let fixture: ComponentFixture<favoritesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [favoritesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(favoritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
