import { TestBed, inject } from '@angular/core/testing';

import { CreateDeviceOrderService } from './create-device-order.service';

describe('CreateDeviceOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateDeviceOrderService]
    });
  });

  it('should be created', inject([CreateDeviceOrderService], (service: CreateDeviceOrderService) => {
    expect(service).toBeTruthy();
  }));
});
