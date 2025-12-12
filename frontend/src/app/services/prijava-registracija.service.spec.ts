import { TestBed } from '@angular/core/testing';

import { PrijavaRegistracijaService } from './prijava-registracija.service';

describe('PrijavaRegistracijaService', () => {
  let service: PrijavaRegistracijaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrijavaRegistracijaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
