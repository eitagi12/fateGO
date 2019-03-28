import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAisSummaryPageComponent } from './device-only-ais-summary-page.component';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

describe('DeviceOnlyAisSummaryPageComponent', () => {
  let component: DeviceOnlyAisSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSummaryPageComponent>;

  setupTestBed({
    declarations: [DeviceOnlyAisSummaryPageComponent],
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
          load: jest.fn(() => {
            return {
              data: {
                reasonCode: 'ยังไม่ตัดสินใจ'
              }
            };
          })
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
    fixture = TestBed.createComponent(DeviceOnlyAisSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
