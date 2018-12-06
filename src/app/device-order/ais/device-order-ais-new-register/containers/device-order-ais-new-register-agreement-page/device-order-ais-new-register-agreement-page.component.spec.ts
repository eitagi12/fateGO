import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterAgreementPageComponent } from './device-order-ais-new-register-agreement-page.component';

describe('DeviceOrderAisNewRegisterAgreementPageComponent', () => {
  let component: DeviceOrderAisNewRegisterAgreementPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterAgreementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterAgreementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterAgreementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
