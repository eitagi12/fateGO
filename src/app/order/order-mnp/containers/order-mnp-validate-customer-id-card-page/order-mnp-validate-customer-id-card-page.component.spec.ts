import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpValidateCustomerIdCardPageComponent } from './order-mnp-validate-customer-id-card-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TokenService, AisNativeService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpValidateCustomerIdCardPageComponent', () => {
  let component: OrderMnpValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OrderMnpValidateCustomerIdCardPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderMnpValidateCustomerIdCardPageComponent],
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
        provide: AisNativeService,
        useValue: {
          getSigned: jest.fn()
        }
      },
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
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
