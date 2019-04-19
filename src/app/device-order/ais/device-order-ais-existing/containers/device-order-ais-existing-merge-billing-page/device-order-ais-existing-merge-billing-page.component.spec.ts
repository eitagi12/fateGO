import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingMergeBillingPageComponent } from './device-order-ais-existing-merge-billing-page.component';

describe('DeviceOrderAisExistingMergeBillingPageComponent', () => {
  let component: DeviceOrderAisExistingMergeBillingPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingMergeBillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingMergeBillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
