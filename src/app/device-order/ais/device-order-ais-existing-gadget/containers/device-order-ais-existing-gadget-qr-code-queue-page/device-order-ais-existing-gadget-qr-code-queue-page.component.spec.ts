import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetQrCodeQueuePageComponent } from './device-order-ais-existing-gadget-qr-code-queue-page.component';

describe('DeviceOrderAisExistingGadgetQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
