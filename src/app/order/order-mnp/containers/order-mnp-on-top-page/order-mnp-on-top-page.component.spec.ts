import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpOnTopPageComponent } from './order-mnp-on-top-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpOnTopPageComponent', () => {
  let component: OrderMnpOnTopPageComponent;
  let fixture: ComponentFixture<OrderMnpOnTopPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule ],
    declarations: [OrderMnpOnTopPageComponent],
    providers: [
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      },
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
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
                mainPackage: {}
              }
            } as Transaction;
          })
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpOnTopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
