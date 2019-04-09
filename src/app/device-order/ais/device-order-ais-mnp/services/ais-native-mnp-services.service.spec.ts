import { TestBed, inject } from '@angular/core/testing';

import { AisNativeMnpServicesService } from './ais-native-mnp-services.service';

describe('AisNativeMnpServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AisNativeMnpServicesService]
    });
  });

  it('should be created', inject([AisNativeMnpServicesService], (service: AisNativeMnpServicesService) => {
    expect(service).toBeTruthy();
  }));
});
