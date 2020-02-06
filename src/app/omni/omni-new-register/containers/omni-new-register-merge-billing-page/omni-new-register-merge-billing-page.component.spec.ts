import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterMergeBillingPageComponent } from './omni-new-register-merge-billing-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OmniNewRegisterMergeBillingPageComponent', () => {
  let component: OmniNewRegisterMergeBillingPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterMergeBillingPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      ReactiveFormsModule
    ],
    declarations: [OmniNewRegisterMergeBillingPageComponent],
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
                billingInformation: {
                  billCycles: []
                },
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
