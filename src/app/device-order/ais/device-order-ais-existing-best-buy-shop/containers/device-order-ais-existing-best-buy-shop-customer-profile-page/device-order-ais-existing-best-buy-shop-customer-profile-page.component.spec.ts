import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent } from './device-order-ais-existing-best-buy-shop-customer-profile-page.component';

describe('DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
