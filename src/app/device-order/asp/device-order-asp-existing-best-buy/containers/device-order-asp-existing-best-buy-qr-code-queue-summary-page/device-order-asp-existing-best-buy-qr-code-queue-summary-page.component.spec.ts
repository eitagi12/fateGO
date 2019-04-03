import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent } from './device-order-asp-existing-best-buy-qr-code-queue-summary-page.component';

describe('DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
