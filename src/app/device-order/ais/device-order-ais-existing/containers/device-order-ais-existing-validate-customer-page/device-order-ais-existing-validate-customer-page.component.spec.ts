import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingValidateCustomerPageComponent } from './device-order-ais-existing-validate-customer-page.component';

describe('DeviceOrderAisExistingValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisExistingValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
