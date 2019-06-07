import { TestBed, inject } from '@angular/core/testing';
import { HomeButtonService } from './home-button.service';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

describe('HomeButtonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeButtonService,
        CookiesStorageService,
        JwtHelperService,
        {
          provide: HomeService,
          useValue: {
            callback: jest.fn()
          }
        },
        {
          provide: AlertService,
          useValue: {
            question: jest.fn()
          }
        },
        {
          provide: CreateOrderService,
          useValue: {
            cancelOrder: jest.fn()
          }
        },
        {
          provide: TransactionService,
          useValue: {
            remove: jest.fn()
          }
        },
        {
          provide: PriceOptionService,
          useValue: {
            remove: jest.fn()
          }
        }
      ]
    });
  });

  it('should be created', inject([HomeButtonService], (service: HomeButtonService) => {
    expect(service).toBeTruthy();
  }));
});
