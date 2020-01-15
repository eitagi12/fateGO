import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OmniNewRegisterSummarySellerCodeComponent } from './omni-new-register-summary-seller-code.component';
import { FormsModule } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TokenService } from 'mychannel-shared-libs';

describe('OmniNewRegisterSummarySellerCodeComponent', () => {
  let component: OmniNewRegisterSummarySellerCodeComponent;
  let fixture: ComponentFixture<OmniNewRegisterSummarySellerCodeComponent>;

  setupTestBed({
    imports: [
      FormsModule
    ],
    declarations: [
      OmniNewRegisterSummarySellerCodeComponent
    ],
    providers: [
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                seller: {
                  locationCode: '1100'
                }
              }
            };
          })
        }
      },
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {
              username: 'MC'
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterSummarySellerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
