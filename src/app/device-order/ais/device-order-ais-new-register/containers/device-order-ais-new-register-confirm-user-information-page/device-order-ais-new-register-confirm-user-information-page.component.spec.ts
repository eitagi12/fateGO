import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterConfirmUserInformationPageComponent } from './device-order-ais-new-register-confirm-user-information-page.component';

describe('DeviceOrderAisNewRegisterConfirmUserInformationPageComponent', () => {
  let component: DeviceOrderAisNewRegisterConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
