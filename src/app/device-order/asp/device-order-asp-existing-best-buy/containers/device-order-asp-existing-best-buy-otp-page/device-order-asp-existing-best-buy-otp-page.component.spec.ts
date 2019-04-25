import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyOtpPageComponent } from './device-order-asp-existing-best-buy-otp-page.component';

describe('DeviceOrderAspExistingBestBuyOtpPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyOtpPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
