import { TestBed, inject } from '@angular/core/testing';

import { BanksPromotionService } from './banks-promotion.service';

describe('BanksPromotionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BanksPromotionService]
    });
  });

  it('should be created', inject([BanksPromotionService], (service: BanksPromotionService) => {
    expect(service).toBeTruthy();
  }));
});
