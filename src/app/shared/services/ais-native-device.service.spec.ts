import { TestBed, inject } from '@angular/core/testing';

import { AisNativeDeviceService } from './ais-native-device.service';

describe('AisNativeDeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AisNativeDeviceService]
    });
  });

  it('should be created', inject([AisNativeDeviceService], (service: AisNativeDeviceService) => {
    expect(service).toBeTruthy();
  }));
});
