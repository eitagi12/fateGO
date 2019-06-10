import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent } from './device-only-kiosk-select-payment-and-receipt-information-page.component';

describe('DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent', () => {
  let component: DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
