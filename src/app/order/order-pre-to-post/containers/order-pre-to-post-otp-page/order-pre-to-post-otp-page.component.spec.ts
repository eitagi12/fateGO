import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostOtpPageComponent } from './order-pre-to-post-otp-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('OrderPreToPostOtpPageComponent', () => {
  let component: OrderPreToPostOtpPageComponent;
  let fixture: ComponentFixture<OrderPreToPostOtpPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      ReactiveFormsModule,
      HttpClientModule
    ],
    declarations: [OrderPreToPostOtpPageComponent],
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
                customer: {},
                simCard: {}
              }
            } as Transaction;
          })
        }
      },
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
