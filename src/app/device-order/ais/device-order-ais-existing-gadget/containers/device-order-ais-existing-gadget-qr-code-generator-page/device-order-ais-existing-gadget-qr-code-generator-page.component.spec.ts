import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent } from './device-order-ais-existing-gadget-qr-code-generator-page.component';

describe('DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
