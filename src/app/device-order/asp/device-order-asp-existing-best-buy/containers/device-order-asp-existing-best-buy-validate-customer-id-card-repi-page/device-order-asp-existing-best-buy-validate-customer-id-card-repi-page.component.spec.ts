import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent } from './device-order-asp-existing-best-buy-validate-customer-id-card-repi-page.component';

describe('DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
