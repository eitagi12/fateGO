import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './device-only-ais-qr-code-queue-page.component';
import { resolve } from 'url';
import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from 'src/app/device-only/ais/device-only-ais/services/home-button.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CreateOrderService } from 'src/app/device-only/ais/device-only-ais/services/create-order.service';
import { QueueService } from 'src/app/device-only/ais/device-only-ais/services/queue.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Pipe({ name: 'mobileNo' })
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DeviceOnlyAisQrCodeQueuePageComponent', () => {
  let component: DeviceOnlyAisQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeQueuePageComponent>;
  let homeService: HomeService;
  let router: Router;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([]),
      ReactiveFormsModule
    ],
    declarations: [
      DeviceOnlyAisQrCodeQueuePageComponent,
      MockMobileNoPipe
    ],
    providers: [
      FormBuilder,
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
                seller: {},
                mpayPayment: {
                  tranId: '123'
                }
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
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      },
      {
        provide: SharedTransactionService,
        useValue: {
          updateSharedTransaction: jest.fn()
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
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    homeService = TestBed.get(HomeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
