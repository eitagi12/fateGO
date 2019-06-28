import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetEcontractPageComponent } from './device-order-ais-existing-gadget-econtract-page.component';

describe('DeviceOrderAisExistingGadgetEcontractPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetEcontractPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetEcontractPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetEcontractPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetEcontractPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
