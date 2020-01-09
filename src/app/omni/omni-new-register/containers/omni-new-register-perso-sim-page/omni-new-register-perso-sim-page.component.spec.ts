import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterPersoSimPageComponent } from './omni-new-register-perso-sim-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OmniNewRegisterPersoSimPageComponent', () => {
  let component: OmniNewRegisterPersoSimPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterPersoSimPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OmniNewRegisterPersoSimPageComponent],
    providers: [
      LocalStorageService,
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                customer: {},
                simCard: {
                  mobileNo: ''
                }
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
    fixture = TestBed.createComponent(OmniNewRegisterPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
