import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceQueuePageComponent } from './device-order-ais-device-queue-page.component';

describe('DeviceOrderAisDeviceQueuePageComponent', () => {
  let component: DeviceOrderAisDeviceQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
