import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisQueuePageComponent } from './device-only-ais-queue-page.component';

describe('DeviceOnlyAisQueuePageComponent', () => {
  let component: DeviceOnlyAisQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        DeviceOnlyAisQueuePageComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
