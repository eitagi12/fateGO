import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterSelectPackagePageComponent } from './order-new-register-select-package-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';

describe('OrderNewRegisterSelectPackagePageComponent', () => {
  let component: OrderNewRegisterSelectPackagePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterSelectPackagePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule, ModalModule.forRoot()],
    declarations: [OrderNewRegisterSelectPackagePageComponent],
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
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                simCard: {
                  mobileNo: ''
                },
                billingInformation: {},
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
