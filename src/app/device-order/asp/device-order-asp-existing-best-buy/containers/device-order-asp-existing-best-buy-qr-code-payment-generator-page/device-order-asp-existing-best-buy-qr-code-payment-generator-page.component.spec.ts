import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent } from './device-order-asp-existing-best-buy-qr-code-payment-generator-page.component';

describe('DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
