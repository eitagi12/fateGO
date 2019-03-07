import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisCheckoutPaymentQrCodePageComponent } from './device-only-ais-checkout-payment-qr-code-page.component';

describe('DeviceOnlyAisCheckoutPaymentQrCodePageComponent', () => {
  let component: DeviceOnlyAisCheckoutPaymentQrCodePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisCheckoutPaymentQrCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisCheckoutPaymentQrCodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisCheckoutPaymentQrCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
