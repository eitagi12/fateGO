import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent } from './device-order-ais-existing-best-buy-shop-qr-code-summary-page.component';

describe('DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
