import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent } from './device-order-ais-existing-gadget-effective-start-date-page.component';

describe('DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
