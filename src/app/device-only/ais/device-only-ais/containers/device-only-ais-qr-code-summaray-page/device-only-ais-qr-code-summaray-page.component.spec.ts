import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceOnlyAisQrCodeSummarayPageComponent } from './device-only-ais-qr-code-summaray-page.component';
import { LocalStorageService } from 'ngx-store';
import { ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE } from '../../constants/route-path.constant';
import { TokenService, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAisQrCodeSummarayPageComponent', () => {
  let component: DeviceOnlyAisQrCodeSummarayPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeSummarayPageComponent>;
  let router: Router;
  let navigateMock: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        DeviceOnlyAisQrCodeSummarayPageComponent,
        MockMobileNoPipe
      ],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: HomeService,
          useValue: {}
        },
        LocalStorageService,
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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeSummarayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    navigateMock = spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method onNext when click next button', async(() => {
    spyOn(component, 'onNext');
    const buttonNext = fixture.debugElement.query(By.css('#button-next'));
    buttonNext.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.onNext).toHaveBeenCalled();
    });
  }));

  it('should call method onBack when click next button', async(() => {
    spyOn(component, 'onBack');
    const buttonBack = fixture.debugElement.query(By.css('#button-back'));
    buttonBack.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.onBack).toHaveBeenCalled();
    });
  }));

  it('should navigate to ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE when execute method onNext', () => {
    component.onNext();
    expect(navigateMock).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
  });

  it('should navigate to ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE when execute method onBack', () => {
    component.onBack();
    expect(navigateMock).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
  });
});
