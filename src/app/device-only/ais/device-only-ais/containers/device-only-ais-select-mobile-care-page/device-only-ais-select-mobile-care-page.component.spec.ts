import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisSelectMobileCarePageComponent } from './device-only-ais-select-mobile-care-page.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DeviceOnlyAisSelectMobileCarePageComponent', () => {
  let component: DeviceOnlyAisSelectMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSelectMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
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
