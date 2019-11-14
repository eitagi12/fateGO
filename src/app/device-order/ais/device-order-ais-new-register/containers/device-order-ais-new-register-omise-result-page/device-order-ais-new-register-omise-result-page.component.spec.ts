import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterOmiseResultPageComponent } from './device-order-ais-new-register-omise-result-page.component';

describe('DeviceOrderAisNewRegisterOmiseResultPageComponent', () => {
  let component: DeviceOrderAisNewRegisterOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
