import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingQrCodeErrorPageComponent } from './device-order-ais-existing-qr-code-error-page.component';

describe('DeviceOrderAisExistingQrCodeErrorPageComponent', () => {
  let component: DeviceOrderAisExistingQrCodeErrorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingQrCodeErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingQrCodeErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingQrCodeErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
