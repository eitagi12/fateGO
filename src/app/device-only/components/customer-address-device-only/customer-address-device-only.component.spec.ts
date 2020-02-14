import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddressDeviceOnlyComponent } from './customer-address-device-only.component';

describe('CustomerAddressDeviceOnlyComponent', () => {
  let component: CustomerAddressDeviceOnlyComponent;
  let fixture: ComponentFixture<CustomerAddressDeviceOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAddressDeviceOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddressDeviceOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
