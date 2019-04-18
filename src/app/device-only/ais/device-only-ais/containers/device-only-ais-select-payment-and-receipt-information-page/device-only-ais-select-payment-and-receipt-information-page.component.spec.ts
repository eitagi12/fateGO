import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './device-only-ais-select-payment-and-receipt-information-page.component';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Pipe, PipeTransform, DebugElement } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE } from '../../constants/route-path.constant';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { SellerService } from '../../services/seller.service';
import { SummarySellerCodeComponent } from '../../components/summary-seller-code/summary-seller-code.component';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}
describe('DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent', () => {
  let component: DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent>;

  let homeService: HomeService;
  let router: Router;
  let nextButton: DebugElement;

  setupTestBed({
    import: [ RouterTestingModule.withRoutes([])],
    declarations: [DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent, MockMobileNoPipe],
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
    fixture = TestBed.createComponent(DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent);
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
