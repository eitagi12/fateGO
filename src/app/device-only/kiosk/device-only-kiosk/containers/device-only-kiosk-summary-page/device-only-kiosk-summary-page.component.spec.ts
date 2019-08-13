import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyKioskSummaryPageComponent } from './device-only-kiosk-summary-page.component';
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

xdescribe('DeviceOnlyKioskSummaryPageComponent', () => {
  let component: DeviceOnlyKioskSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskSummaryPageComponent>;
  let homeService: HomeService;
  let router: Router;
  let nextButton: DebugElement;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyKioskSummaryPageComponent,
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
          load: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskSummaryPageComponent);
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

  describe('method', () => {
  //   it('should be alert popup "กรุณากรอกข้อมูลให้ถูกต้อง" when call checkSeller with sellerNo is null', () => {
  //     component.checkSeller({ sellerNo: null });
  //     fixture.detectChanges();
  //     expect(component.alertService.warning).toHaveBeenCalledWith('กรุณากรอกข้อมูลให้ถูกต้อง');
  //   });

  //   it('should be go to home when call onHome', () => {
  //     const goHomeSpy = spyOn(homeService, 'goToHome');
  //     component.onHome();
  //     expect(goHomeSpy).toHaveBeenCalled();
  //   });

  //   it('should be nevigate "/device-only/ais/mobile-care" when call onBack', () => {
  //     const navigateSpy = spyOn(router, 'navigate');
  //     component.onBack();
  //     expect(navigateSpy).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
  //   });

  //   xit('should be nevigate "/device-only/ais/checkout-payment" when call onNext', () => {
  //     component.onNext();
  //     expect(component.checkSeller({})).toBeTruthy();
  //   });

  //   it('should be destroy when call ngOnDestroy', () => {
  //     component.checkSeller({ sellerNo: '1' });
  //     component.ngOnDestroy();
  //     expect(component.transactionService.save).toHaveBeenCalledWith({
  //       data: {
  //         seller: {}
  //       }
  //     });
  //   });
  });
});
