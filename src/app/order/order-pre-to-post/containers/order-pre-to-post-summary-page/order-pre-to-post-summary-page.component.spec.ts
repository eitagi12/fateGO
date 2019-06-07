import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostSummaryPageComponent } from './order-pre-to-post-summary-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderPreToPostSummaryPageComponent', () => {
  let component: OrderPreToPostSummaryPageComponent;
  let fixture: ComponentFixture<OrderPreToPostSummaryPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderPreToPostSummaryPageComponent],
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
                action: {},
                mainPackage: {},
                billingInformation: {
                  billCycleData: {}
                },
                customer: {},
                simCard: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
