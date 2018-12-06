import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterDeviceSellingPageComponent } from './device-order-ais-new-register-device-selling-page.component';

describe('DeviceOrderAisNewRegisterDeviceSellingPageComponent', () => {
  let component: DeviceOrderAisNewRegisterDeviceSellingPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterDeviceSellingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterDeviceSellingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterDeviceSellingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
