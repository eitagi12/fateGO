import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent } from './device-order-ais-existing-best-buy-shop-customer-info-page.component';

describe('DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
