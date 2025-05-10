import { TestBed } from '@angular/core/testing';

import { MarqueCasaService } from './marque-casa.service';

describe('MarqueCasaService', () => {
  let service: MarqueCasaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarqueCasaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
