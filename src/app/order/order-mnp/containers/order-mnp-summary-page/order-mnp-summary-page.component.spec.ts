import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpSummaryPageComponent } from './order-mnp-summary-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpSummaryPageComponent', () => {
  let component: OrderMnpSummaryPageComponent;
  let fixture: ComponentFixture<OrderMnpSummaryPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule ],
    declarations: [OrderMnpSummaryPageComponent],
    providers: [
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                mainPackage: {},
                billingInformation: {
                  billCycleData: {}
                },
                simCard: {
                  mobileNo: ''
                },
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
