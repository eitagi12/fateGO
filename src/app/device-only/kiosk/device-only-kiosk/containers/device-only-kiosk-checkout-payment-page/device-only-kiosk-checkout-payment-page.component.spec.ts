import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyKioskCheckoutPaymentPageComponent } from './device-only-kiosk-checkout-payment-page.component';
import { Pipe, PipeTransform, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

@Pipe({ name: 'mobileNo' })
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DeviceOnlyKioskCheckoutPaymentPageComponent', () => {
  let component: DeviceOnlyKioskCheckoutPaymentPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskCheckoutPaymentPageComponent>;
  let homeService: HomeService;
  let router: Router;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyKioskCheckoutPaymentPageComponent,
      MockMobileNoPipe
    ],
    providers: [
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
          load: jest.fn()
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
      {
        provide: HomeButtonService,
        useValue: {
          initEventButtonHome: jest.fn()
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskCheckoutPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    homeService = TestBed.get(HomeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
