import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetCheckOutPageComponent } from './device-order-ais-existing-gadget-check-out-page.component';

describe('DeviceOrderAisExistingGadgetCheckOutPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetCheckOutPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetCheckOutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetCheckOutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetCheckOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
