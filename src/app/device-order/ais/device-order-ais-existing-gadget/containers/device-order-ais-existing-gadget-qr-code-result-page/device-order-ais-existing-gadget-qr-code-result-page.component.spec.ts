import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetQrCodeResultPageComponent } from './device-order-ais-existing-gadget-qr-code-result-page.component';

describe('DeviceOrderAisExistingGadgetQrCodeResultPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
