import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent } from './device-order-ais-existing-best-buy-shop-validate-customer-page.component';

describe('DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
