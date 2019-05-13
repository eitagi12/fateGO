import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingSelectPackageOntopPageComponent } from './device-order-ais-existing-select-package-ontop-page.component';

describe('DeviceOrderAisExistingSelectPackageOntopPageComponent', () => {
  let component: DeviceOrderAisExistingSelectPackageOntopPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingSelectPackageOntopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingSelectPackageOntopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingSelectPackageOntopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
