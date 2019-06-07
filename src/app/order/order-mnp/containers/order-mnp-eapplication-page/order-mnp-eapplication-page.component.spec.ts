import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpEapplicationPageComponent } from './order-mnp-eapplication-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';

describe('OrderMnpEapplicationPageComponent', () => {
  let component: OrderMnpEapplicationPageComponent;
  let fixture: ComponentFixture<OrderMnpEapplicationPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule ],
    declarations: [OrderMnpEapplicationPageComponent],
    providers: [
      {
        provide: CreateEapplicationService,
        useValue: {
          createEapplication: jest.fn(() => Promise.resolve())
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {} as Transaction;
          })
        }
      },
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
    fixture = TestBed.createComponent(OrderMnpEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
