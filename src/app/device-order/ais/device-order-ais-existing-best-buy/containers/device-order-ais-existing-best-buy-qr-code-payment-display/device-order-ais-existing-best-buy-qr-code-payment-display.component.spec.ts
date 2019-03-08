import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyQrCodePaymentDisplayComponent } from './device-order-ais-existing-best-buy-qr-code-payment-display.component';

describe('DeviceOrderAisExistingBestBuyQrCodePaymentDisplayComponent', () => {
  let component: DeviceOrderAisExistingBestBuyQrCodePaymentDisplayComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyQrCodePaymentDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyQrCodePaymentDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyQrCodePaymentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
