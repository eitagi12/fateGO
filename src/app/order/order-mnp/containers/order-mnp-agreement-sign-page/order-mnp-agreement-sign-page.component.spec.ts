import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpAgreementSignPageComponent } from './order-mnp-agreement-sign-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService, AisNativeService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

describe('OrderMnpAgreementSignPageComponent', () => {
  let component: OrderMnpAgreementSignPageComponent;
  let fixture: ComponentFixture<OrderMnpAgreementSignPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule ],
    declarations: [OrderMnpAgreementSignPageComponent],
    providers: [
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {channelType: ''};
          })
        }
      },
      {
        provide: AisNativeService,
        useValue: {
          getSigned: jest.fn(() => of()),
          openSigned: jest.fn(() => of())
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
    fixture = TestBed.createComponent(OrderMnpAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
