import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostCustomerInfoPageComponent } from './order-pre-to-post-customer-info-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderPreToPostCustomerInfoPageComponent', () => {
  let component: OrderPreToPostCustomerInfoPageComponent;
  let fixture: ComponentFixture<OrderPreToPostCustomerInfoPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OrderPreToPostCustomerInfoPageComponent],
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
    fixture = TestBed.createComponent(OrderPreToPostCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
