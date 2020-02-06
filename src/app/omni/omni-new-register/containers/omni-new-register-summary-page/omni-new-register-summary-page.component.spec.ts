import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterSummaryPageComponent } from './omni-new-register-summary-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';

describe('OmniNewRegisterSummaryPageComponent', () => {
  let component: OmniNewRegisterSummaryPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterSummaryPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OmniNewRegisterSummaryPageComponent],
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
                  billCycleData: {}
                },
                customer: {},
                simCard: {
                  mobileNo: ''
                },
                mainPackage: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
