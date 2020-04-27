import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceOmiseSummaryPageComponent } from './device-order-ais-device-omise-summary-page.component';

describe('DeviceOrderAisDeviceOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisDeviceOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
