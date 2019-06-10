import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspResultQueuePageComponent } from './device-only-asp-result-queue-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAspResultQueuePageComponent', () => {
  let component: DeviceOnlyAspResultQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspResultQueuePageComponent>;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspResultQueuePageComponent,
      MockMobileNoPipe
    ],
    providers: [
      {
        provide: PageLoadingService,
        useValue: {
          closeLoading: jest.fn()
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
                payment: {
                  paymentType: 'QR_CODE'
                }
              }
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
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspResultQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
