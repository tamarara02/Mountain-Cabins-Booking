import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikendiceTuristaComponent } from './vikendice-turista.component';

describe('VikendiceTuristaComponent', () => {
  let component: VikendiceTuristaComponent;
  let fixture: ComponentFixture<VikendiceTuristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VikendiceTuristaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikendiceTuristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
