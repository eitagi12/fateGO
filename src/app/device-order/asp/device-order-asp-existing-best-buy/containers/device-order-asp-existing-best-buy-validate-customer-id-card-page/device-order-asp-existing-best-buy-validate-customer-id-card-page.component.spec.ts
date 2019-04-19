import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent } from './device-order-asp-existing-best-buy-validate-customer-id-card-page.component';

describe('DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
