import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent } from './device-order-ais-existing-best-buy-qr-code-queue-page.component';

describe('DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
