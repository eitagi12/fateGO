import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisOmiseSummaryPageComponent } from './device-only-ais-omise-summary-page.component';

describe('DeviceOnlyAisOmiseSummaryPageComponent', () => {
  let component: DeviceOnlyAisOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
