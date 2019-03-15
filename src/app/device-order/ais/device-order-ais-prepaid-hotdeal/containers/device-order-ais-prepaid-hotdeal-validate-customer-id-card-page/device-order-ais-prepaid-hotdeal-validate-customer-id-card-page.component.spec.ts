import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent } from './device-order-ais-prepaid-hotdeal-validate-customer-id-card-page.component';

describe('DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
