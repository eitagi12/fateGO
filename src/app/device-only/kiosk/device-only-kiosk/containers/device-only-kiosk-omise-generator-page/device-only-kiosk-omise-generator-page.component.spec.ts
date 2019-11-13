import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskOmiseGeneratorPageComponent } from './device-only-kiosk-omise-generator-page.component';

describe('DeviceOnlyKioskOmiseGeneratorPageComponent', () => {
  let component: DeviceOnlyKioskOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
