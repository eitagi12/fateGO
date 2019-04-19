import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingChangePackagePageComponent } from './device-order-ais-existing-change-package-page.component';

describe('DeviceOrderAisExistingChangePackagePageComponent', () => {
  let component: DeviceOrderAisExistingChangePackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingChangePackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingChangePackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingChangePackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
