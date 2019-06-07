import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostMergeBillingPageComponent } from './order-pre-to-post-merge-billing-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderPreToPostMergeBillingPageComponent', () => {
  let component: OrderPreToPostMergeBillingPageComponent;
  let fixture: ComponentFixture<OrderPreToPostMergeBillingPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      ReactiveFormsModule
    ],
    declarations: [OrderPreToPostMergeBillingPageComponent],
    providers: [
      LocalStorageService,
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
                mainPackage: {},
                customer: {},
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
