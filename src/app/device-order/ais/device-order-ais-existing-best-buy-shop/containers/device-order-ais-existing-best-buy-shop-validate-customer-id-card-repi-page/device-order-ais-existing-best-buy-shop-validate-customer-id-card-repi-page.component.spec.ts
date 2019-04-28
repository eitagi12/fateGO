import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent } from './device-order-ais-existing-best-buy-shop-validate-customer-id-card-repi-page.component';

describe('DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
