import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterIdCardCapturePageComponent } from './order-new-register-id-card-capture-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderNewRegisterIdCardCapturePageComponent', () => {
  let component: OrderNewRegisterIdCardCapturePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterIdCardCapturePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OrderNewRegisterIdCardCapturePageComponent],
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
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
