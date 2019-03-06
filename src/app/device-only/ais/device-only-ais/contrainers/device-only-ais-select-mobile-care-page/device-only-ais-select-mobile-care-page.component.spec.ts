import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisSelectMobileCarePageComponent } from './device-only-ais-select-mobile-care-page.component';

describe('DeviceOnlyAisSelectMobileCarePageComponent', () => {
  let component: DeviceOnlyAisSelectMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSelectMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisSelectMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisSelectMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
