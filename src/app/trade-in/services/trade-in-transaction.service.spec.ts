import { TestBed, inject } from '@angular/core/testing';

import { TradeInTransactionService } from './trade-in-transaction.service';

describe('TradeInTransactionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TradeInTransactionService]
    });
  });

  it('should be created', inject([TradeInTransactionService], (service: TradeInTransactionService) => {
    expect(service).toBeTruthy();
  }));
});
