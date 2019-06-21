import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspQueuePageComponent } from './device-only-asp-queue-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TokenService, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Pipe, PipeTransform } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAspQueuePageComponent', () => {
  let component: DeviceOnlyAspQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspQueuePageComponent>;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspQueuePageComponent,
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
      PageLoadingService,
      {
        provide: QueueService,
        useValue: {
          checkQueueLocation: jest.fn(() => {
            return Promise.resolve();
          })
        }
      },
      {
        provide: SharedTransactionService,
        useValue: {}
      },
      {
        provide: CreateOrderService,
        useValue: {
          createOrderDeviceOnly: jest.fn()
        }
      },
      {
        provide: AlertService,
        useValue: {
          notify:  jest.fn()
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
                },
                simCard: {
                  mobileNo: '0891234567'
                }
              },
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
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
