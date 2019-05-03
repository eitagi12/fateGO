import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent } from './device-order-ais-existing-best-buy-shop-payment-detail-page.component';

describe('DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
