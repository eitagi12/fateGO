import { TestBed, inject } from '@angular/core/testing';
import { BillingAddressService } from './billing-address.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from 'mychannel-shared-libs';

describe('BillingAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillingAddressService,
        HttpClient,
        HttpHandler,
        CookiesStorageService,
        JwtHelperService,
        {
          provide: TokenService,
          useValue: {
            getUser: jest.fn()
          }
        }
      ]
    });
  });

  it('should be created', inject([BillingAddressService], (service: BillingAddressService) => {
    expect(service).toBeTruthy();
  }));
});
