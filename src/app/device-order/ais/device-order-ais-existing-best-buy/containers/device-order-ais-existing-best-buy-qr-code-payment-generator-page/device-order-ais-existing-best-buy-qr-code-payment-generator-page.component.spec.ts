import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent } from './device-order-ais-existing-best-buy-qr-code-payment-generator-page.component';

describe('DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
