import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostValidateCustomerRepiPageComponent } from './device-order-ais-pre-to-post-validate-customer-repi-page.component';

describe('DeviceOrderAisPreToPostValidateCustomerRepiPageComponent', () => {
  let component: DeviceOrderAisPreToPostValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostValidateCustomerRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostValidateCustomerRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
