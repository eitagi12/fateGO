import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterSelectNumberPageComponent } from './order-new-register-select-number-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';

describe('OrderNewRegisterSelectNumberPageComponent', () => {
  let component: OrderNewRegisterSelectNumberPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterSelectNumberPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OrderNewRegisterSelectNumberPageComponent],
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
    fixture = TestBed.createComponent(OrderNewRegisterSelectNumberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
