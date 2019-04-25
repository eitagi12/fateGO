import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent } from './device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
