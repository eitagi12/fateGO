import { TestBed, inject } from '@angular/core/testing';

import { CreateDeviceOrderAisNewRegisterService } from './create-device-order-ais-new-register.service';

describe('CreateDeviceOrderAisNewRegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateDeviceOrderAisNewRegisterService]
    });
  });

  it('should be created', inject([CreateDeviceOrderAisNewRegisterService], (service: CreateDeviceOrderAisNewRegisterService) => {
    expect(service).toBeTruthy();
  }));
});
