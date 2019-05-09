import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOrderDetailComponent } from './summary-order-detail.component';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

describe('SummaryOrderDetailComponent', () => {
  let component: SummaryOrderDetailComponent;
  let fixture: ComponentFixture<SummaryOrderDetailComponent>;

  setupTestBed({
    declarations: [SummaryOrderDetailComponent],
    providers: [
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
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
