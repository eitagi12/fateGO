import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealSelectPackagePageComponent } from './device-order-ais-prepaid-hotdeal-select-package-page.component';

describe('DeviceOrderAisPrepaidHotdealSelectPackagePageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealSelectPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
