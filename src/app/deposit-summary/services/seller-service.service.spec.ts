import { TestBed, inject } from '@angular/core/testing';

import { SellerService } from './seller-service.service';

describe('SellerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerService]
    });
  });

  it('should be created', inject([SellerService], (service: SellerService) => {
    expect(service).toBeTruthy();
  }));
});
