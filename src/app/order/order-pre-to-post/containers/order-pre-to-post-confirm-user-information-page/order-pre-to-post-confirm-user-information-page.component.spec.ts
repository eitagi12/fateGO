import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPreToPostConfirmUserInformationPageComponent } from './order-pre-to-post-confirm-user-information-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';

describe('OrderPreToPostConfirmUserInformationPageComponent', () => {
  let component: OrderPreToPostConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<OrderPreToPostConfirmUserInformationPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderPreToPostConfirmUserInformationPageComponent],
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
                customer: {},
                simCard: {
                  mobileNo: ''
                },
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
    fixture = TestBed.createComponent(OrderPreToPostConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
