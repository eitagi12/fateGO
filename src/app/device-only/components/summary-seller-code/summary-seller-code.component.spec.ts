import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SummarySellerCodeComponent } from './summary-seller-code.component';
import { FormsModule } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TokenService } from 'mychannel-shared-libs';

describe('SummarySellerCodeComponent', () => {
  let component: SummarySellerCodeComponent;
  let fixture: ComponentFixture<SummarySellerCodeComponent>;

  setupTestBed({
    imports: [
      FormsModule
    ],
    declarations: [
      SummarySellerCodeComponent
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
    fixture = TestBed.createComponent(SummarySellerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
