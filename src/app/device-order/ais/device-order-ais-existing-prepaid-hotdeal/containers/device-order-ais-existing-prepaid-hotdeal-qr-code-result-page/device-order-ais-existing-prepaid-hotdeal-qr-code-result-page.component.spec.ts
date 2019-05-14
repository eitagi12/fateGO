import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent } from './device-order-ais-existing-prepaid-hotdeal-qr-code-result-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
