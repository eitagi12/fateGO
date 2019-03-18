import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DeviceOnlyAisQrCodeSummarayPageComponent } from './device-only-ais-qr-code-summaray-page.component';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE } from '../../constants/route-path.constant';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAisQrCodeSummarayPageComponent', () => {
  let component: DeviceOnlyAisQrCodeSummarayPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeSummarayPageComponent>;

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
        CookiesStorageService,
        {
          provide: JwtHelperService,
          useValue: {}
        },
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeSummarayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    jest.spyOn(component.router, 'navigate').mockImplementation();
    component.onNext();
    expect(component.router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
  });

  it('should navigate to ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE when execute method onBack', () => {
    jest.spyOn(component.router, 'navigate').mockImplementation();
    component.onBack();
    expect(component.router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
  });
});
