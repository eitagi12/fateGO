import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealSummaryPageComponent } from './device-order-ais-prepaid-hotdeal-summary-page.component';

describe('DeviceOrderAisPrepaidHotdealSummaryPageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
