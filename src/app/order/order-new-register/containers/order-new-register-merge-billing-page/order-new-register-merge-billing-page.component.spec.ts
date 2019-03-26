import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterMergeBillingPageComponent } from './order-new-register-merge-billing-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderNewRegisterMergeBillingPageComponent', () => {
  let component: OrderNewRegisterMergeBillingPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterMergeBillingPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      ReactiveFormsModule
    ],
    declarations: [OrderNewRegisterMergeBillingPageComponent],
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
                billingInformation: {
                  billCycles: []
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
    fixture = TestBed.createComponent(OrderNewRegisterMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
