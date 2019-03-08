import { HttpClient, HttpHandler } from '@angular/common/http';

import { TestBed, inject } from '@angular/core/testing';

import { BillingAddressService } from './billing-address.service';

describe('BillingAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillingAddressService, HttpClient, HttpHandler ]
    });
  });

  it('should be created', inject([BillingAddressService], (service: BillingAddressService) => {
    expect(service).toBeTruthy();
  }));
});
