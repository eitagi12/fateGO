import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpQrCodeQueuePageComponent } from './device-order-ais-mnp-qr-code-queue-page.component';

describe('DeviceOrderAisMnpQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisMnpQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
