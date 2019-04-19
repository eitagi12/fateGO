import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent } from './device-order-ais-existing-prepaid-hotdeal-validate-customer-repi-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
