import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskQrCodeSummaryPageComponent } from './device-only-kiosk-qr-code-summary-page.component';

describe('DeviceOnlyKioskQrCodeSummaryPageComponent', () => {
  let component: DeviceOnlyKioskQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
