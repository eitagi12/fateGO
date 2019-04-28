import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent } from './device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page.component';

describe('DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
