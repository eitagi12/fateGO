import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingCustomerInfoPageComponent } from './device-order-ais-existing-customer-info-page.component';

describe('DeviceOrderAisExistingCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisExistingCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
