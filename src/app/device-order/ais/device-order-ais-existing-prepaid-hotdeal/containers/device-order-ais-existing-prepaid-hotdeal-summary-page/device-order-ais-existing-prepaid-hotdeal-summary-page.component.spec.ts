import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent } from './device-order-ais-existing-prepaid-hotdeal-summary-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
