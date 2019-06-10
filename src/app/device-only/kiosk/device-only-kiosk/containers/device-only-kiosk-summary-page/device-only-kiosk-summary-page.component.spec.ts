import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskSummaryPageComponent } from './device-only-kiosk-summary-page.component';

describe('DeviceOnlyKioskSummaryPageComponent', () => {
  let component: DeviceOnlyKioskSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
