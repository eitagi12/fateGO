import { TestBed, inject } from '@angular/core/testing';

import { CreateDeviceOrderBestBuyService } from './create-device-order-best-buy.service';

describe('CreateDeviceOrderBestBuyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateDeviceOrderBestBuyService]
    });
  });

  it('should be created', inject([CreateDeviceOrderBestBuyService], (service: CreateDeviceOrderBestBuyService) => {
    expect(service).toBeTruthy();
  }));
});
