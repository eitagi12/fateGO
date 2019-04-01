import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpEbillingAddressPageComponent } from './device-order-ais-mnp-ebilling-address-page.component';

describe('DeviceOrderAisMnpEbillingAddressPageComponent', () => {
  let component: DeviceOrderAisMnpEbillingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
