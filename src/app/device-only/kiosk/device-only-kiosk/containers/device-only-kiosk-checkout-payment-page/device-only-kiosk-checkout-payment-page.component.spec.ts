import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskCheckoutPaymentPageComponent } from './device-only-kiosk-checkout-payment-page.component';

describe('DeviceOnlyKioskCheckoutPaymentPageComponent', () => {
  let component: DeviceOnlyKioskCheckoutPaymentPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskCheckoutPaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskCheckoutPaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskCheckoutPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
