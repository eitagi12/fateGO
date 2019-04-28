import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopCheckOutPageComponent } from './device-order-ais-existing-best-buy-shop-check-out-page.component';

describe('DeviceOrderAisExistingBestBuyShopCheckOutPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopCheckOutPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopCheckOutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopCheckOutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopCheckOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
