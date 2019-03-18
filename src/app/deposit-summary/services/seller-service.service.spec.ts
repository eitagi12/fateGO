import { TestBed, inject } from '@angular/core/testing';

import { SellerServiceService } from './seller-service.service';

describe('SellerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerServiceService]
    });
  });

  it('should be created', inject([SellerServiceService], (service: SellerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
