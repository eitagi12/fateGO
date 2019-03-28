import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent } from './device-order-asp-existing-best-buy-qr-code-queue-page.component';

describe('DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
