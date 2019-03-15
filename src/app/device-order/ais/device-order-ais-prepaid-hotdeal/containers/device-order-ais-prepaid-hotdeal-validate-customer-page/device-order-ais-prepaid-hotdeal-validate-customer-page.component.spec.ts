import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent } from './device-order-ais-prepaid-hotdeal-validate-customer-page.component';

describe('DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
