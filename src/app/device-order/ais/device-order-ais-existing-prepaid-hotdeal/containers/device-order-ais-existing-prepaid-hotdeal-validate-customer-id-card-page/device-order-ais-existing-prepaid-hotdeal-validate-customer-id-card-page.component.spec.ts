import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent } from './device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
