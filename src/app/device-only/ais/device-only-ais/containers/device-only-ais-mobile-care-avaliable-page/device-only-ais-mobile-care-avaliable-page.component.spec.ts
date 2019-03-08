import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisMobileCareAvaliablePageComponent } from './device-only-ais-mobile-care-avaliable-page.component';

describe('DeviceOnlyAisMobileCareAvaliablePageComponent', () => {
  let component: DeviceOnlyAisMobileCareAvaliablePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisMobileCareAvaliablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ DeviceOnlyAisMobileCareAvaliablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisMobileCareAvaliablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
