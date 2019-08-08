import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetChangePackagePageComponent } from './device-order-ais-existing-gadget-change-package-page.component';

describe('DeviceOrderAisExistingGadgetChangePackagePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetChangePackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetChangePackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetChangePackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetChangePackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
