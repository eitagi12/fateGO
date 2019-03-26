import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterConfirmUserInformationPageComponent } from './order-new-register-confirm-user-information-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';

describe('OrderNewRegisterConfirmUserInformationPageComponent', () => {
  let component: OrderNewRegisterConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterConfirmUserInformationPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderNewRegisterConfirmUserInformationPageComponent],
    providers: [
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
                billingInformation: {
                  billCycleData: {},
                  billDeliveryAddress: {}
                },
                customer: {},
                simCard: {
                  mobileNo: ''
                }
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
