import { TestBed } from '@angular/core/testing';

import { CreateDeviceOrderBestBuyService } from './create-device-order-best-buy.service';

describe('CreateDeviceOrderBestBuyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateDeviceOrderBestBuyService = TestBed.get(CreateDeviceOrderBestBuyService);
    expect(service).toBeTruthy();
  });
});
