import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent } from './device-only-asp-select-payment-and-receipt-information-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeService, AlertService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { LocalStorageService, CookiesStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

describe('DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent', () => {
  let component: DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent>;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent
    ],
    providers: [
      HttpClient,
      HttpHandler,
      LocalStorageService,
      CookiesStorageService,
      {
        provide: Router,
        useValue: {
          navigate: jest.fn()
        }
      },
      {
        provide: HomeService,
        useValue: {
          goToHome: jest.fn()
        }
      },
      {
        provide: HomeButtonService,
        useValue: {
          initEventButtonHome: jest.fn()
        }
      },
      {
        provide: AlertService,
        useValue: {
          warning: jest.fn()
        }
      },
      CreateOrderService,
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                seller: {}
              }
            };
          }),
          // update: jest.fn(),
          // save: jest.fn()
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              productDetail: {
                name: 'APPLE'
              },
              productStock: {
                color: 'GOLD'
              },
              trade: {
                priceType: 'NORMAL',
                normalPrice: '22590',
                promotionPrice: '18500'
              }
            };
          })
        }
      },
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {
              locationCode: ''
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
