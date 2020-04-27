import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceOmiseGeneratorPageComponent } from './device-order-ais-device-omise-generator-page.component';

describe('DeviceOrderAisDeviceOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisDeviceOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
