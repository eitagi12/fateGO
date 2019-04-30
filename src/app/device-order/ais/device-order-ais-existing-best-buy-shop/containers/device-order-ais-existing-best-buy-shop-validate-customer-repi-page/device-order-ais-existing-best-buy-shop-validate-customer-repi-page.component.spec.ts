import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent } from './device-order-ais-existing-best-buy-shop-validate-customer-repi-page.component';

describe('DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
