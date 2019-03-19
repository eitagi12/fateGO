import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent } from './device-order-ais-prepaid-hotdeal-customer-info-page.component';

describe('DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
