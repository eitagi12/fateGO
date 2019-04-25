import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingQrCodeQueuePageComponent } from './device-order-ais-existing-qr-code-queue-page.component';

describe('DeviceOrderAisExistingQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisExistingQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
