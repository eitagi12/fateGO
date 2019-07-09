import { TestBed, inject } from '@angular/core/testing';

import { TradeInService } from './trade-in.service';

describe('TradeInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TradeInService]
    });
  });

  it('should be created', inject([TradeInService], (service: TradeInService) => {
    expect(service).toBeTruthy();
  }));
});
