import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent } from './device-order-ais-existing-gadget-omise-generator-page.component';

describe('DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
