import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterEapplicationPageComponent } from './order-new-register-eapplication-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderNewRegisterEapplicationPageComponent', () => {
  let component: OrderNewRegisterEapplicationPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterEapplicationPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderNewRegisterEapplicationPageComponent],
    providers: [
      LocalStorageService,
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      },
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
                  billCycleData: {}
                },
                customer: {},
                simCard: {},
                mainPackage: {}
              }
            } as Transaction;
          })
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
