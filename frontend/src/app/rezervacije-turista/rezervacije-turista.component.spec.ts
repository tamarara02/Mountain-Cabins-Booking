import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezervacijeTuristaComponent } from './rezervacije-turista.component';

describe('RezervacijeTuristaComponent', () => {
  let component: RezervacijeTuristaComponent;
  let fixture: ComponentFixture<RezervacijeTuristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RezervacijeTuristaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RezervacijeTuristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
