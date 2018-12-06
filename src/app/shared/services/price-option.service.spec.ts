import { TestBed, inject } from '@angular/core/testing';

import { PriceOptionService } from './price-option.service';

describe('PriceOptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceOptionService]
    });
  });

  it('should be created', inject([PriceOptionService], (service: PriceOptionService) => {
    expect(service).toBeTruthy();
  }));
});
