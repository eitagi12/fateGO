import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterOmiseGeneratorPageComponent } from './device-order-ais-new-register-omise-generator-page.component';

describe('DeviceOrderAisNewRegisterOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisNewRegisterOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
