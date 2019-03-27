import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent } from './device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-repi-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
