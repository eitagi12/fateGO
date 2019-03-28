import { TestBed, inject } from '@angular/core/testing';

import { HomeButtonService } from './home-button.service';
import { TokenService, AlertService } from 'mychannel-shared-libs';
import { CreateOrderService } from './create-order.service';
import { LocalStorageService } from 'ngx-store';

describe('HomeButtonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: {
            getUser: jest.fn()
          }
        },
        {
          provide: AlertService,
          useValue: {}
        },
        {
          provide: CreateOrderService,
          useValue: {}
        },
        LocalStorageService
      ]
    });
  });

  it('should be created', inject([HomeButtonService], (service: HomeButtonService) => {
    expect(service).toBeTruthy();
  }));
});
