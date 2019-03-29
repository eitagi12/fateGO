import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyOtpPageComponent } from './device-order-ais-existing-best-buy-otp-page.component';

describe('DeviceOrderAisExistingBestBuyOtpPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyOtpPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
