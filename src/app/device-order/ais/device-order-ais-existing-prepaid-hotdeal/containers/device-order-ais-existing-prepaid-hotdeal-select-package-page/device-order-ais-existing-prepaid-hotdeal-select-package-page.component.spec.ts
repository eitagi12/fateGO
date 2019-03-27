import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent } from './device-order-ais-existing-prepaid-hotdeal-select-package-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
