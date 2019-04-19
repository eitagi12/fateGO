import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostOtpPageComponent } from './device-order-ais-pre-to-post-otp-page.component';

describe('DeviceOrderAisPreToPostOtpPageComponent', () => {
  let component: DeviceOrderAisPreToPostOtpPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
