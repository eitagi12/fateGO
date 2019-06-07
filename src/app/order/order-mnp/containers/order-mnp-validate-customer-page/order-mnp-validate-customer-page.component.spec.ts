import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpValidateCustomerPageComponent } from './order-mnp-validate-customer-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpValidateCustomerPageComponent', () => {
  let component: OrderMnpValidateCustomerPageComponent;
  let fixture: ComponentFixture<OrderMnpValidateCustomerPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderMnpValidateCustomerPageComponent],
    providers: [
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                action: {}
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
    fixture = TestBed.createComponent(OrderMnpValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
