import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspQrCodeSummaryPageComponent } from './device-only-asp-qr-code-summary-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { LocalStorageService } from 'ngx-store';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAspQrCodeSummaryPageComponent', () => {
  let component: DeviceOnlyAspQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        DeviceOnlyAspQrCodeSummaryPageComponent,
        MockMobileNoPipe
      ],
      providers: [
        HttpClient,
        HttpHandler,
        LocalStorageService,
        {
          provide: Router,
            useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: HomeService,
          goToHome: jest.fn()
        },
        {
          provide: HomeButtonService,
          useValue: {
            initEventButtonHome: jest.fn()
          }
        },
        QRCodePaymentService,
        {
          provide: TokenService,
          useValue: {
            getUser: jest.fn()
          }
        },
        {
          provide: TransactionService,
          useValue: {
            load: jest.fn(() => {
              return {
                data: {
                  payment: {
                    paymentQrCodeType: 'THAI_QR'
                  },
                  preBooking: {
                    depositAmt: ''
                  }
                }
              };
            })
          }
        },
        {
          provide: PriceOptionService,
          useValue: {
            load: jest.fn(() => {
              return {
                trade : {
                  priceType: 'NORMAL',
                  normalPrice: '22590',
                  promotionPrice: '18500'
                }
              };
            })
          }
        },
        {
          provide: QRCodePaymentService,
          useValue: {
            getBrannerImagePaymentQrCodeType: jest.fn(() => {
              return {
                logo: ''
              };
            })
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
