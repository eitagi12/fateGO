import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent } from './device-order-ais-existing-prepaid-hotdeal-validate-customer-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
