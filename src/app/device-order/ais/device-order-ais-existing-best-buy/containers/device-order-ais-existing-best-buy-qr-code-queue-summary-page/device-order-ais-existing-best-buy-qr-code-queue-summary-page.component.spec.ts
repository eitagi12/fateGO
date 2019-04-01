import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyQrCodeQueueSummaryPageComponent } from './device-order-ais-existing-best-buy-qr-code-queue-summary-page.component';

describe('DeviceOrderAisExistingBestBuyQrCodeQueueSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyQrCodeQueueSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyQrCodeQueueSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyQrCodeQueueSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyQrCodeQueueSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
