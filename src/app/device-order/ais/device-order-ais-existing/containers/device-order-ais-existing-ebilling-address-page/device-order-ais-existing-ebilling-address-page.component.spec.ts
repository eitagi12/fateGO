import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingEbillingAddressPageComponent } from './device-order-ais-existing-ebilling-address-page.component';

describe('DeviceOrderAisExistingEbillingAddressPageComponent', () => {
  let component: DeviceOrderAisExistingEbillingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
