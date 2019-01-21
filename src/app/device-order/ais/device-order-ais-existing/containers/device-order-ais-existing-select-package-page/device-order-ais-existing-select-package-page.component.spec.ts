import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingSelectPackagePageComponent } from './device-order-ais-existing-select-package-page.component';

describe('DeviceOrderAisExistingSelectPackagePageComponent', () => {
  let component: DeviceOrderAisExistingSelectPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
