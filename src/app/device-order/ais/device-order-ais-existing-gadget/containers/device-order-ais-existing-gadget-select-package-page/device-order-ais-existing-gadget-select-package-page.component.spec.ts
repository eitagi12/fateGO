import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetSelectPackagePageComponent } from './device-order-ais-existing-gadget-select-package-page.component';

describe('DeviceOrderAisExistingGadgetSelectPackagePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetSelectPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
