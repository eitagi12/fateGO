import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterFaceComparePageComponent } from './order-new-register-face-compare-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderNewRegisterFaceComparePageComponent', () => {
  let component: OrderNewRegisterFaceComparePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterFaceComparePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [ OrderNewRegisterFaceComparePageComponent ],
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
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
