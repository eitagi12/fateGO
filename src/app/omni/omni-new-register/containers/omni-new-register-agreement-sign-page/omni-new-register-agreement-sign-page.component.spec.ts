import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterAgreementSignPageComponent } from './omni-new-register-agreement-sign-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService, AisNativeService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OmniNewRegisterAgreementSignPageComponent', () => {
  let component: OmniNewRegisterAgreementSignPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterAgreementSignPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule ],
    declarations: [OmniNewRegisterAgreementSignPageComponent],
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
    fixture = TestBed.createComponent(OmniNewRegisterAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
