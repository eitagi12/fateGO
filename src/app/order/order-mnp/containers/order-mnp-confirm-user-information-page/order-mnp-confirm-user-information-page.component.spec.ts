import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpConfirmUserInformationPageComponent } from './order-mnp-confirm-user-information-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpConfirmUserInformationPageComponent', () => {
  let component: OrderMnpConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<OrderMnpConfirmUserInformationPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule ],
    declarations: [OrderMnpConfirmUserInformationPageComponent],
    providers: [
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                customer: {},
                billingInformation: {
                  billDeliveryAddress: {}
                },
                mainPackage: {},
                simCard: {
                  mobileNo: ''
                }
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
    fixture = TestBed.createComponent(OrderMnpConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
