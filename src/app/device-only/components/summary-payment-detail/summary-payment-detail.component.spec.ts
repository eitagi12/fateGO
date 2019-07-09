import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryPaymentDetailComponent } from './summary-payment-detail.component';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';

describe('SummaryPaymentDetailComponent', () => {
  let component: SummaryPaymentDetailComponent;
  let fixture: ComponentFixture<SummaryPaymentDetailComponent>;

  setupTestBed({
    declarations: [SummaryPaymentDetailComponent],
    providers: [
      HttpClient,
      HttpHandler,
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              trade: {
                priceType: 'NORMAL',
                normalPrice: '22590',
                promotionPrice: '18500'
              }
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
                customer: {
                  homeNo: '',
                  moo: '',
                  room: '',
                  floor: '',
                  buildingName: '',
                  soi: '',
                  street: '',
                  tumbol: '',
                  amphur: '',
                  province: '',
                  zipCode: ''
                },
                mobileCarePackage: {
                  customAttributes: ''
                }
              }
            };
          }),
        }
      },
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {
              data: {
                userType: 'ASP'
              }
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });

});
