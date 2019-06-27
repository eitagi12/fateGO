import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetEligibleMobilePageComponent } from './device-order-ais-existing-gadget-eligible-mobile-page.component';

describe('DeviceOrderAisExistingGadgetEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
