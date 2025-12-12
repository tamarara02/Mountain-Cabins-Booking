import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikendiceVlasnikComponent } from './vikendice-vlasnik.component';

describe('VikendiceVlasnikComponent', () => {
  let component: VikendiceVlasnikComponent;
  let fixture: ComponentFixture<VikendiceVlasnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VikendiceVlasnikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikendiceVlasnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
