import { TestBed, inject } from '@angular/core/testing';

import { CreateDeviceOrderAisExistingPrepaidHotdealService } from './create-device-order-ais-existing-prepaid-hotdeal.service';

describe('CreateDeviceOrderAisExistingPrepaidHotdealService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateDeviceOrderAisExistingPrepaidHotdealService]
    });
  });

  // tslint:disable-next-line:max-line-length
  it('should be created', inject([CreateDeviceOrderAisExistingPrepaidHotdealService], (service: CreateDeviceOrderAisExistingPrepaidHotdealService) => {
    expect(service).toBeTruthy();
  }));
});
