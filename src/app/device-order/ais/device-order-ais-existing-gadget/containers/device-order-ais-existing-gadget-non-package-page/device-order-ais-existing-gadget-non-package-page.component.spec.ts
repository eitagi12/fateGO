import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetNonPackagePageComponent } from './device-order-ais-existing-gadget-non-package-page.component';

describe('DeviceOrderAisExistingGadgetNonPackagePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetNonPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetNonPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetNonPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetNonPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
