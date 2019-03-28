import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent } from './device-order-ais-existing-prepaid-hotdeal-customer-profile-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
