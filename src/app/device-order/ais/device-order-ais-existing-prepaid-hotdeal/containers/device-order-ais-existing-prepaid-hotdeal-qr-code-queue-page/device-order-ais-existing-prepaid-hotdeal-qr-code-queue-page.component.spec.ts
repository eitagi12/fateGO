import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent } from './device-order-ais-existing-prepaid-hotdeal-qr-code-queue-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
