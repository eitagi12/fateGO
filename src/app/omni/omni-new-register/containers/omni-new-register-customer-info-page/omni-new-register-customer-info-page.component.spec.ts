import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterCustomerInfoPageComponent } from './omni-new-register-customer-info-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';

describe('OmniNewRegisterCustomerInfoPageComponent', () => {
  let component: OmniNewRegisterCustomerInfoPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterCustomerInfoPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [OmniNewRegisterCustomerInfoPageComponent],
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
      },
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
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
