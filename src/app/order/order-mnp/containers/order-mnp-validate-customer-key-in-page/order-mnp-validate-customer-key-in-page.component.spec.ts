import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpValidateCustomerKeyInPageComponent } from './order-mnp-validate-customer-key-in-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';

describe('OrderMnpValidateCustomerKeyInPageComponent', () => {
  let component: OrderMnpValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<OrderMnpValidateCustomerKeyInPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderMnpValidateCustomerKeyInPageComponent],
    providers: [
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn()
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
    fixture = TestBed.createComponent(OrderMnpValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
