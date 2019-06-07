import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostAgreementSignPageComponent } from './order-pre-to-post-agreement-sign-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService, AisNativeService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { of } from 'rxjs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderPreToPostAgreementSignPageComponent', () => {
  let component: OrderPreToPostAgreementSignPageComponent;
  let fixture: ComponentFixture<OrderPreToPostAgreementSignPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderPreToPostAgreementSignPageComponent],
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
      },
      {
        provide: AisNativeService,
        useValue: {
          getSigned: jest.fn(() => of()),
          openSigned: jest.fn(() => of())
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
