import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent } from './device-order-ais-existing-best-buy-validate-customer-repi-page.component';

describe('DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
