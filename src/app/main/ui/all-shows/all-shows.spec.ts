import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShows } from './all-shows';

describe('AllShows', () => {
  let component: AllShows;
  let fixture: ComponentFixture<AllShows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllShows]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllShows);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
