import { HttpClient, HttpHandler } from '@angular/common/http';

import { TestBed, inject } from '@angular/core/testing';

import { BillingAddressService } from './billing-address.service';
import { TokenService } from 'mychannel-shared-libs';

describe('BillingAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillingAddressService,
        HttpClient,
        HttpHandler,
        {
          provide: TokenService,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject([BillingAddressService], (service: BillingAddressService) => {
    expect(service).toBeTruthy();
  }));
});
