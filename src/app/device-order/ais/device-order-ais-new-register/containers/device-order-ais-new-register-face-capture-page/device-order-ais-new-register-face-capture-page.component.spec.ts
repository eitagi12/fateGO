import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterFaceCapturePageComponent } from './device-order-ais-new-register-face-capture-page.component';

describe('DeviceOrderAisNewRegisterFaceCapturePageComponent', () => {
  let component: DeviceOrderAisNewRegisterFaceCapturePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterFaceCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterFaceCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
