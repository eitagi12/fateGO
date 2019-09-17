import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceResultPageComponent } from './device-order-ais-device-result-page.component';

describe('DeviceOrderAisDeviceResultPageComponent', () => {
  let component: DeviceOrderAisDeviceResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
