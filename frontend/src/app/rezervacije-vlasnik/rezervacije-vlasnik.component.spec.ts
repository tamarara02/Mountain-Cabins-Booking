import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezervacijeVlasnikComponent } from './rezervacije-vlasnik.component';

describe('RezervacijeVlasnikComponent', () => {
  let component: RezervacijeVlasnikComponent;
  let fixture: ComponentFixture<RezervacijeVlasnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RezervacijeVlasnikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RezervacijeVlasnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
