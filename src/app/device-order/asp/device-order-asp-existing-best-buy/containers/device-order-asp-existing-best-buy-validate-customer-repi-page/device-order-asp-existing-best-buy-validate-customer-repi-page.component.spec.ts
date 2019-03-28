import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent } from './device-order-asp-existing-best-buy-validate-customer-repi-page.component';

describe('DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
