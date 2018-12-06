import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterFaceConfirmPageComponent } from './device-order-ais-new-register-face-confirm-page.component';

describe('DeviceOrderAisNewRegisterFaceConfirmPageComponent', () => {
  let component: DeviceOrderAisNewRegisterFaceConfirmPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterFaceConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterFaceConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
