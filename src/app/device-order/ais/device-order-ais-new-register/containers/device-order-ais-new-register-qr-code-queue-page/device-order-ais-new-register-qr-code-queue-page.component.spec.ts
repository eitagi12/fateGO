import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterQrCodeQueuePageComponent } from './device-order-ais-new-register-qr-code-queue-page.component';

describe('DeviceOrderAisNewRegisterQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisNewRegisterQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
