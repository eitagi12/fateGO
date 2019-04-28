import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopOtpPageComponent } from './device-order-ais-existing-best-buy-shop-otp-page.component';

describe('DeviceOrderAisExistingBestBuyShopOtpPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopOtpPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
