import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskOmiseSummaryPageComponent } from './device-only-kiosk-omise-summary-page.component';

describe('DeviceOnlyKioskOmiseSummaryPageComponent', () => {
  let component: DeviceOnlyKioskOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
