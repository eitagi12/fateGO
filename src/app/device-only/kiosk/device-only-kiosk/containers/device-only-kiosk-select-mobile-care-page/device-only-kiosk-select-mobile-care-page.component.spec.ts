import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskSelectMobileCarePageComponent } from './device-only-kiosk-select-mobile-care-page.component';

describe('DeviceOnlyKioskSelectMobileCarePageComponent', () => {
  let component: DeviceOnlyKioskSelectMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskSelectMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskSelectMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskSelectMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
