import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterEapplicationPageComponent } from './device-order-ais-new-register-eapplication-page.component';

describe('DeviceOrderAisNewRegisterEapplicationPageComponent', () => {
  let component: DeviceOrderAisNewRegisterEapplicationPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
