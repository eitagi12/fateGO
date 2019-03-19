import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent } from './device-order-ais-prepaid-hotdeal-eligible-mobile-page.component';

describe('DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
