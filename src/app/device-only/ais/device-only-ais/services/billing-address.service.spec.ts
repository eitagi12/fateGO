import { TestBed, inject } from '@angular/core/testing';

import { BillingAddressService } from './billing-address.service';

describe('BillingAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillingAddressService]
    });
  });

  it('should be created', inject([BillingAddressService], (service: BillingAddressService) => {
    expect(service).toBeTruthy();
  }));
});
