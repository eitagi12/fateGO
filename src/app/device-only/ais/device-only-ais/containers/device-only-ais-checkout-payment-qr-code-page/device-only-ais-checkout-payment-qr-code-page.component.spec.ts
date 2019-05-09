import { PipeTransform, Pipe } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceOnlyAisCheckoutPaymentQrCodePageComponent } from './device-only-ais-checkout-payment-qr-code-page.component';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { Router } from '@angular/router';
import { TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAisCheckoutPaymentQrCodePageComponent', () => {
  let component: DeviceOnlyAisCheckoutPaymentQrCodePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisCheckoutPaymentQrCodePageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule
    ],
    declarations: [
      DeviceOnlyAisCheckoutPaymentQrCodePageComponent,
      MockMobileNoPipe
    ],
    providers: [
      CookiesStorageService,
      {
        provide: JwtHelperService,
        useValue: {}
      },
      HttpClient,
      HttpHandler,
      {
        provide: Router,
        useValue: {}
      },
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn()
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              trade : {
                priceType : 'NORMAL',
                normalPrice: '22590',
                promotionPrice: '18500'
              }
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisCheckoutPaymentQrCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
