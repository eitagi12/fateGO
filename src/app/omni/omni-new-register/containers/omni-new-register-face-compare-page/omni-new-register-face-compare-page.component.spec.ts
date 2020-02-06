import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OmniNewRegisterFaceComparePageComponent } from './omni-new-register-face-compare-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';

describe('OmniNewRegisterFaceComparePageComponent', () => {
  let component: OmniNewRegisterFaceComparePageComponent;
  let fixture: ComponentFixture<OmniNewRegisterFaceComparePageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [ OmniNewRegisterFaceComparePageComponent ],
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
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
