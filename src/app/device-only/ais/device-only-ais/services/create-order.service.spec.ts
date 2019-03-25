import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { CreateOrderService } from './create-order.service';
import { CookiesStorageService } from 'ngx-store';
import { TokenService } from 'mychannel-shared-libs';

describe('CreateOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateOrderService,
        CookiesStorageService,
        HttpClient,
        HttpHandler,
        {
          provide: TokenService,
          useValue: {
            getUser: jest.fn()
          }
        }
      ]
    });
  });

  it('should be created', inject([CreateOrderService], (service: CreateOrderService) => {
    expect(service).toBeTruthy();
  }));
});
