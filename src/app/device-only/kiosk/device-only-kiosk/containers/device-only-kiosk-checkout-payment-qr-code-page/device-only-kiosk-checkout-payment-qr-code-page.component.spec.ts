import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskCheckoutPaymentQrCodePageComponent } from './device-only-kiosk-checkout-payment-qr-code-page.component';

describe('DeviceOnlyKioskCheckoutPaymentQrCodePageComponent', () => {
  let component: DeviceOnlyKioskCheckoutPaymentQrCodePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskCheckoutPaymentQrCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskCheckoutPaymentQrCodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskCheckoutPaymentQrCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
