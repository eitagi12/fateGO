import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent } from './device-order-ais-existing-prepaid-hotdeal-qr-code-generator-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
