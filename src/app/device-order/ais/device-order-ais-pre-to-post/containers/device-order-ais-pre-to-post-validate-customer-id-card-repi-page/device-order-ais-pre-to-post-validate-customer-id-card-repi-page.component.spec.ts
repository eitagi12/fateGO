import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent } from './device-order-ais-pre-to-post-validate-customer-id-card-repi-page.component';

describe('DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent', () => {
  let component: DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
