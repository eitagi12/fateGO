import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent } from './device-order-ais-existing-prepaid-hotdeal-customer-info-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
