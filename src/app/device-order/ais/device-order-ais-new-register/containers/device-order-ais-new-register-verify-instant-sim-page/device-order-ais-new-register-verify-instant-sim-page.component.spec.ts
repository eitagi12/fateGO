import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterVerifyInstantSimPageComponent } from './device-order-ais-new-register-verify-instant-sim-page.component';

describe('DeviceOrderAisNewRegisterVerifyInstantSimPageComponent', () => {
  let component: DeviceOrderAisNewRegisterVerifyInstantSimPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterVerifyInstantSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterVerifyInstantSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterVerifyInstantSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
