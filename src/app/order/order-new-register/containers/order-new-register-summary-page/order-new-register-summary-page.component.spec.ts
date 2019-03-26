import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterSummaryPageComponent } from './order-new-register-summary-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';

describe('OrderNewRegisterSummaryPageComponent', () => {
  let component: OrderNewRegisterSummaryPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterSummaryPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OrderNewRegisterSummaryPageComponent],
    providers: [
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {
              channelType: ''
            };
          })
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
