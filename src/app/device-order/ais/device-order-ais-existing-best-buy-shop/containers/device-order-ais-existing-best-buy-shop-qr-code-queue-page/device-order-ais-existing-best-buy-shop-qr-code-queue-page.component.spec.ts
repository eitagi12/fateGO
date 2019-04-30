import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent } from './device-order-ais-existing-best-buy-shop-qr-code-queue-page.component';

describe('DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
