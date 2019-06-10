import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspCheckoutPaymentPageComponent } from './device-only-asp-checkout-payment-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeService } from 'mychannel-shared-libs';
import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAspCheckoutPaymentPageComponent', () => {
  let component: DeviceOnlyAspCheckoutPaymentPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspCheckoutPaymentPageComponent>;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspCheckoutPaymentPageComponent,
      MockMobileNoPipe
    ],
    providers: [
      HttpClient,
      HttpHandler,
      CookiesStorageService,
      {
        provide: JwtHelperService,
        useValue: {}
      },
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
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                receiptInfo: {
                  telNo: '0891234567'
                }
              }
            };
          })
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              trade: {
                priceType: 'NORMAL',
                normalPrice: '22590',
                promotionPrice: '18500'
              }
            };
          })
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspCheckoutPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
