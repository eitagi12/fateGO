import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisEditBillingAddressPageComponent } from './device-only-ais-edit-billing-address-page.component';

describe('DeviceOnlyAisEditBillingAddressPageComponent', () => {
  let component: DeviceOnlyAisEditBillingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisEditBillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisEditBillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisEditBillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
