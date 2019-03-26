import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterVerifyInstantSimPageComponent } from './order-new-register-verify-instant-sim-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';

describe('OrderNewRegisterVerifyInstantSimPageComponent', () => {
  let component: OrderNewRegisterVerifyInstantSimPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterVerifyInstantSimPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderNewRegisterVerifyInstantSimPageComponent],
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
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterVerifyInstantSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
