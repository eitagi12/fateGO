import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent } from './device-order-ais-prepaid-hotdeal-validate-customer-id-card-repi-page.component';

describe('DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
