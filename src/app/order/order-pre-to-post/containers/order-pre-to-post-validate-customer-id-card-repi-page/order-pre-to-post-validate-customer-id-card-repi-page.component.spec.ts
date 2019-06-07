import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostValidateCustomerIdCardRepiPageComponent } from './order-pre-to-post-validate-customer-id-card-repi-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderPreToPostValidateCustomerIdCardRepiPageComponent', () => {
  let component: OrderPreToPostValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<OrderPreToPostValidateCustomerIdCardRepiPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderPreToPostValidateCustomerIdCardRepiPageComponent],
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
                mainPackage: {},
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
