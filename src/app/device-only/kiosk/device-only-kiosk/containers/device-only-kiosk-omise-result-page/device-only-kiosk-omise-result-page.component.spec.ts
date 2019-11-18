import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskOmiseResultPageComponent } from './device-only-kiosk-omise-result-page.component';

describe('DeviceOnlyKioskOmiseResultPageComponent', () => {
  let component: DeviceOnlyKioskOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
