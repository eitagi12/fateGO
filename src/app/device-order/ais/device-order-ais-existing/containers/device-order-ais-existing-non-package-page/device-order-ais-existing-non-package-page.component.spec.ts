import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingNonPackagePageComponent } from './device-order-ais-existing-non-package-page.component';

describe('DeviceOrderAisExistingNonPackagePageComponent', () => {
  let component: DeviceOrderAisExistingNonPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingNonPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingNonPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingNonPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
