import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent } from './device-order-ais-existing-best-buy-shop-validate-customer-id-card-page.component';

describe('DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
