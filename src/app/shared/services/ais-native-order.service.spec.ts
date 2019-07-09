import { TestBed, inject } from '@angular/core/testing';

import { AisNativeOrderService } from './ais-native-order.service';

describe('AisNativeOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AisNativeOrderService]
    });
  });

  it('should be created', inject([AisNativeOrderService], (service: AisNativeOrderService) => {
    expect(service).toBeTruthy();
  }));
});
