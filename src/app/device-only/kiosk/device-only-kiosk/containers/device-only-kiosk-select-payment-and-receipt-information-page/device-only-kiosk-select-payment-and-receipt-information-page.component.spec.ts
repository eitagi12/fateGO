import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent } from './device-only-kiosk-select-payment-and-receipt-information-page.component';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Pipe, PipeTransform, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { SummarySellerCodeComponent } from '../../../../components/summary-seller-code/summary-seller-code.component';

@Pipe({ name: 'mobileNo' })
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent', () => {
  let component: DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent>;
  let homeService: HomeService;
  let router: Router;
  let nextButton: DebugElement;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent,
      MockMobileNoPipe
    ],
    providers: [
      HttpClient,
      HttpHandler,
      CookiesStorageService,
      {
        provide: AlertService,
        useValue: {
          warning: jest.fn()
        }
      },
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
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
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                seller: {}
              }
            };
          }),
          update: jest.fn(),
          save: jest.fn()
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              productDetail: {
                name: ''
              },
              productStock: {
                color: ''
              },
              trade: {
                promotionPrice: 0
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
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    homeService = TestBed.get(HomeService);
    nextButton = fixture.debugElement.query(By.css('button#button-next'));
  });

  describe('templates', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

});
