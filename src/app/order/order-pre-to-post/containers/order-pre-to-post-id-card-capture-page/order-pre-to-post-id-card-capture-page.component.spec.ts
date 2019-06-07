import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostIdCardCapturePageComponent } from './order-pre-to-post-id-card-capture-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderPreToPostIdCardCapturePageComponent', () => {
  let component: OrderPreToPostIdCardCapturePageComponent;
  let fixture: ComponentFixture<OrderPreToPostIdCardCapturePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OrderPreToPostIdCardCapturePageComponent],
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
                mainPackage: {},
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
