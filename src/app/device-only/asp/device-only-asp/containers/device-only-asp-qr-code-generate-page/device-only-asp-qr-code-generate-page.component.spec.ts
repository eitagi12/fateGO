import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspQrCodeGeneratePageComponent } from './device-only-asp-qr-code-generate-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { Observable } from 'rxjs';

describe('DeviceOnlyAspQrCodeGeneratePageComponent', () => {
  let component: DeviceOnlyAspQrCodeGeneratePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspQrCodeGeneratePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
      ],
      declarations: [
        DeviceOnlyAspQrCodeGeneratePageComponent
      ],
      providers: [
        HttpClient,
        HttpHandler,
        LocalStorageService,
        CookiesStorageService,
        {
          provide: JwtHelperService,
          useValue: {
            decodeToken: jest.fn()
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: AlertService,
          useValue: {
            warning: jest.fn()
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
        {
          provide: TransactionService,
          useValue: {
            load: jest.fn(() => {
              return {
                data: {
                  payment: {
                    paymentType: 'QR_CODE',
                    paymentQrCodeType: 'THAI_QR'
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
                trade: {
                  priceType: 'NORMAL',
                  normalPrice: '22590',
                  promotionPrice: '18500'
                },
                productStock: {
                  company: 'WDS'
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
                branner: '',
                branner_detail: '',
              };
            }),
            getSoID: jest.fn(() => {
              return {
                orderID: {
                  error: ''
                }
              };
            }),
            getQRCode: jest.fn(() => {
              return Promise.resolve();
            }),
            insertPreMpay: jest.fn(() => {
              return Promise.resolve();
            }),
            updateMpayObjectInTransaction: jest.fn(),
            checkInquiryCallbackMpay: jest.fn(() => {
              return Observable.create();
            })
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspQrCodeGeneratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

});
