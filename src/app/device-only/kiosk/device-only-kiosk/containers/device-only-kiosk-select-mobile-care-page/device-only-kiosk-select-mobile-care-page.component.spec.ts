import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { DeviceOnlyKioskSelectMobileCarePageComponent } from './device-only-kiosk-select-mobile-care-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TokenService, HomeService } from 'mychannel-shared-libs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('DeviceOnlyKioskSelectMobileCarePageComponent', () => {
  let component: DeviceOnlyKioskSelectMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskSelectMobileCarePageComponent>;
  let nextButton: DebugElement;
  let router: Router;
  let homeService: HomeService;

  setupTestBed({
    imports: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyKioskSelectMobileCarePageComponent
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
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {}
            };
          }),
          update: jest.fn()
        }
      },
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
      HomeService
    ]
  });

  beforeEach(() => {
    router = TestBed.get(Router);
    homeService = TestBed.get(HomeService);
    fixture = TestBed.createComponent(DeviceOnlyKioskSelectMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nextButton = fixture.debugElement.query(By.css('button#button-next'));
  });

  describe('templates', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('methods', () => {
  //   it('should be disable next button when component initial', () => {
  //     fixture.detectChanges();
  //     expect(nextButton.nativeElement.disabled).toBeTruthy();
  //   });

  //   it('should be navigate to "/device-only/ais/select-payment" when call onBack', () => {
  //     const navigateSpy = spyOn(router, 'navigate');
  //     component.onBack();
  //     expect(navigateSpy).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  //   });

  //   it('should be navigate to "/device-only/ais/summary" when call onNext', () => {
  //     const navigateSpy = spyOn(router, 'navigate');
  //     component.onNext();
  //     expect(navigateSpy).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  //   });

  //   it('should be go to home when call onHome', () => {
  //     const goHomeSpy = spyOn(homeService, 'goToHome');
  //     component.onHome();
  //     expect(goHomeSpy).toHaveBeenCalled();
  //   });

  //   it('should be update mobileCarePackage in transaction object when call onPromotion', () => {
  //     component.onPromotion({ id: 1, title: 'Mobile Care Mock' });
  //     expect(component.transaction.data.mobileCarePackage['id']).toBe(1);
  //     expect(component.transaction.data.mobileCarePackage['title']).toBe('Mobile Care Mock');
  //   });

  //   it('should be save simCard in transaction object when call onCompleted', () => {
  //     component.onMobile({ title: 'Mobile Care Mock' });
  //     expect(component.transaction.data.simCard['title']).toBe('Mobile Care Mock');
  //   });

  //   it('should be destroy when call ngOnDestroy', () => {
  //     component.onPromotion({ id: 1, title: 'Mobile Care Mock' });
  //     component.ngOnDestroy();
  //     expect(component.transactionService.update).toHaveBeenCalledWith({
  //       data: {
  //         ...component.transaction.data,
  //         mobileCarePackage: {
  //           id: 1,
  //           title: 'Mobile Care Mock'
  //         }
  //       }
  //     });
  //   });
  });
});
