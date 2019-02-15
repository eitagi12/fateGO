import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent } from './device-order-ais-pre-to-post-validate-customer-id-card-page.component';

describe('DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
