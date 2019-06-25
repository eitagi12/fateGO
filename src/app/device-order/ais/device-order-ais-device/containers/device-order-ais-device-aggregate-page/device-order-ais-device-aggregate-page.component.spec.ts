import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceAggregatePageComponent } from './device-order-ais-device-aggregate-page.component';

describe('DeviceOrderAisDeviceAggregatePageComponent', () => {
  let component: DeviceOrderAisDeviceAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
