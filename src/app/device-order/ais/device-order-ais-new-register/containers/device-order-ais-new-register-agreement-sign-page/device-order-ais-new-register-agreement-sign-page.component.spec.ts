import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterAgreementSignPageComponent } from './device-order-ais-new-register-agreement-sign-page.component';

describe('DeviceOrderAisNewRegisterAgreementSignPageComponent', () => {
  let component: DeviceOrderAisNewRegisterAgreementSignPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
