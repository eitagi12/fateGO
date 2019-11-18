import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealOmiseSummaryPageComponent } from './device-order-ais-existing-prepaid-hotdeal-omise-summary-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
