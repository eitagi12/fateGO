import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpIdCardCapturePageComponent } from './order-mnp-id-card-capture-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

describe('OrderMnpIdCardCapturePageComponent', () => {
  let component: OrderMnpIdCardCapturePageComponent;
  let fixture: ComponentFixture<OrderMnpIdCardCapturePageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule ],
    declarations: [OrderMnpIdCardCapturePageComponent],
    providers: [
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
      },
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
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
