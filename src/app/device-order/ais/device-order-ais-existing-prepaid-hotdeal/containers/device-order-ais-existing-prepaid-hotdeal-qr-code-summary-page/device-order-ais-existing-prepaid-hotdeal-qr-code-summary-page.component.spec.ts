import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent } from './device-order-ais-existing-prepaid-hotdeal-qr-code-summary-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
