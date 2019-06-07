import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterEbillingAddressPageComponent } from './order-new-register-ebilling-address-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderNewRegisterEbillingAddressPageComponent', () => {
  let component: OrderNewRegisterEbillingAddressPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterEbillingAddressPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderNewRegisterEbillingAddressPageComponent],
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
                  billDeliveryAddress: {}
                },
                customer: {}
              }
            } as Transaction;
          })
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
