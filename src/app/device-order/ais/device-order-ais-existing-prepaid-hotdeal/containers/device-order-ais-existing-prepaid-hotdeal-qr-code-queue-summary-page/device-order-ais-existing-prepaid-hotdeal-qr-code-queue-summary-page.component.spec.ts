import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent } from './device-order-ais-existing-prepaid-hotdeal-qr-code-queue-summary-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
