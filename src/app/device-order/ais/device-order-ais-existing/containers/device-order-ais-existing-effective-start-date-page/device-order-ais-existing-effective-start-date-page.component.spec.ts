import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingEffectiveStartDatePageComponent } from './device-order-ais-existing-effective-start-date-page.component';

describe('DeviceOrderAisExistingEffectiveStartDatePageComponent', () => {
  let component: DeviceOrderAisExistingEffectiveStartDatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingEffectiveStartDatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingEffectiveStartDatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingEffectiveStartDatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
