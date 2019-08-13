import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent } from './device-order-ais-existing-gadget-select-package-ontop-page.component';

describe('DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
