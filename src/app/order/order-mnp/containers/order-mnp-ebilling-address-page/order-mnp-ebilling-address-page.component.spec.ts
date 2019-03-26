import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpEbillingAddressPageComponent } from './order-mnp-ebilling-address-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpEbillingAddressPageComponent', () => {
  let component: OrderMnpEbillingAddressPageComponent;
  let fixture: ComponentFixture<OrderMnpEbillingAddressPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule ],
    declarations: [OrderMnpEbillingAddressPageComponent],
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
                customer: {},
                billingInformation: {
                  billDeliveryAddress: {}
                }
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
