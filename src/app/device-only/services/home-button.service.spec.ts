import { TestBed, inject } from '@angular/core/testing';
import { HomeButtonService } from './home-button.service';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HomeService, AlertService, TokenService } from 'mychannel-shared-libs';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeButtonService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
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
            remove: jest.fn(),
            load: jest.fn()
          }
        },
        {
          provide: PriceOptionService,
          useValue: {
            remove: jest.fn()
          }
        },
        {
          provide: TokenService,
          useValue: {
            getUser: jest.fn()
          }
        }
      ]
    });
  });

  it('should be created', inject([HomeButtonService], (service: HomeButtonService) => {
    expect(service).toBeTruthy();
  }));
});
