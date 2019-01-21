import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent } from './device-order-ais-prt-to-post-validate-customer-repi-page.component';

describe('DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent', () => {
  let component: DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
