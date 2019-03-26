import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpMergeBillingPageComponent } from './order-mnp-merge-billing-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpMergeBillingPageComponent', () => {
  let component: OrderMnpMergeBillingPageComponent;
  let fixture: ComponentFixture<OrderMnpMergeBillingPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule ],
    declarations: [OrderMnpMergeBillingPageComponent],
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
                action: {},
                mainPackage: {},
                billingInformation: {
                  billCycles: []
                }
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
