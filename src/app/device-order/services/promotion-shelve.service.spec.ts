import { TestBed, inject } from '@angular/core/testing';

import { PromotionShelveService } from './promotion-shelve.service';

describe('PromotionShelveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromotionShelveService]
    });
  });

  it('should be created', inject([PromotionShelveService], (service: PromotionShelveService) => {
    expect(service).toBeTruthy();
  }));
});
