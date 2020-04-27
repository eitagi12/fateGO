import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceOmiseQueuePageComponent } from './device-order-ais-device-omise-queue-page.component';

describe('DeviceOrderAisDeviceOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisDeviceOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
