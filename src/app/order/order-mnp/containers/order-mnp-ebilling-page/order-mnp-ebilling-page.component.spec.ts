import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpEbillingPageComponent } from './order-mnp-ebilling-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpEbillingPageComponent', () => {
  let component: OrderMnpEbillingPageComponent;
  let fixture: ComponentFixture<OrderMnpEbillingPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule ],
    declarations: [OrderMnpEbillingPageComponent],
    providers: [
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                billingInformation: {}
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
    fixture = TestBed.createComponent(OrderMnpEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
