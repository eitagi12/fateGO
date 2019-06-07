import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpCustomerInfoPageComponent } from './order-mnp-customer-info-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpCustomerInfoPageComponent', () => {
  let component: OrderMnpCustomerInfoPageComponent;
  let fixture: ComponentFixture<OrderMnpCustomerInfoPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule ],
    declarations: [OrderMnpCustomerInfoPageComponent],
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
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
