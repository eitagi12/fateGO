import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostValidateCustomerPageComponent } from './device-order-ais-pre-to-post-validate-customer-page.component';

describe('DeviceOrderAisPreToPostValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisPreToPostValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
