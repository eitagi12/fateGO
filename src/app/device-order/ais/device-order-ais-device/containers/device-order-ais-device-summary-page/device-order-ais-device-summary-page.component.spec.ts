import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceSummaryPageComponent } from './device-order-ais-device-summary-page.component';

describe('DeviceOrderAisDeviceSummaryPageComponent', () => {
  let component: DeviceOrderAisDeviceSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
