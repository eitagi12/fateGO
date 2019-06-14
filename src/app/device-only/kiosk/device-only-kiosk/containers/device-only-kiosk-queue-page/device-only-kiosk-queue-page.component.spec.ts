import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyKioskQueuePageComponent } from './device-only-kiosk-queue-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { FormBuilder } from '@angular/forms';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { QueueService } from 'src/app/device-only/services/queue.service';

@Pipe({ name: 'mobileNo' })
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DeviceOnlyKioskQueuePageComponent', () => {
  let component: DeviceOnlyKioskQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskQueuePageComponent>;
  let homeService: HomeService;
  let router: Router;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule
    ],
    declarations: [
      DeviceOnlyKioskQueuePageComponent,
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
        provide: TransactionService,
        useValue: {
          load: jest.fn()
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
        provide: CreateOrderService,
        useValue: {
          createOrderDeviceOnly: jest.fn()
        }
      },
      {
        provide: QueueService,
        useValue: {
          checkQueueLocation: jest.fn(() => {
            return Promise.resolve();
          })
        }
      },
      {
        provide: PageLoadingService,
        useValue: {
          closeLoading: jest.fn()
        }
      },
      {
        provide: SharedTransactionService,
        useValue: {
          updateSharedTransaction: jest.fn()
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

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    homeService = TestBed.get(HomeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
