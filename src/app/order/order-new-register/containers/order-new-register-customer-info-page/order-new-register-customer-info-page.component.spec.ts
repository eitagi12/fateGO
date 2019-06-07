import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterCustomerInfoPageComponent } from './order-new-register-customer-info-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';

describe('OrderNewRegisterCustomerInfoPageComponent', () => {
  let component: OrderNewRegisterCustomerInfoPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterCustomerInfoPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OrderNewRegisterCustomerInfoPageComponent],
    providers: [
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
      },
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
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
