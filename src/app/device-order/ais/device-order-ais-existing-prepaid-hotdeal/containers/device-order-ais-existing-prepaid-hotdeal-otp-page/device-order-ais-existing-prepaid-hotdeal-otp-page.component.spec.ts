import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealOtpPageComponent } from './device-order-ais-existing-prepaid-hotdeal-otp-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealOtpPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealOtpPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
