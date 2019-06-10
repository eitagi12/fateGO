import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspQrCodeQueuePageComponent } from './device-only-asp-qr-code-queue-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { PageLoadingService, TokenService, HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Pipe, PipeTransform } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';

@Pipe({ name: 'mobileNo' })
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DeviceOnlyAspQrCodeQueuePageComponent', () => {
  let component: DeviceOnlyAspQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspQrCodeQueuePageComponent>;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspQrCodeQueuePageComponent,
      MockMobileNoPipe
    ],
    providers: [
      HttpClient,
      HttpHandler,
      {
        provide: Router,
        useValue: {
          navigate: jest.fn()
        }
      },
      FormBuilder,
      {
        provide: HomeService,
        goToHome: jest.fn()
      },
      {
        provide: HomeButtonService,
        useValue: {
          initEventButtonHome: jest.fn()
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
      PageLoadingService,
      {
        provide: SharedTransactionService,
        useValue: {
          updateSharedTransaction: jest.fn()
        }
      },
      {
        provide: CreateOrderService,
        useValue: {
          createOrderDeviceOnly : jest.fn()
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
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
