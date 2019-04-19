import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostEbillingAddressPageComponent } from './device-order-ais-pre-to-post-ebilling-address-page.component';

describe('DeviceOrderAisPreToPostEbillingAddressPageComponent', () => {
  let component: DeviceOrderAisPreToPostEbillingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
