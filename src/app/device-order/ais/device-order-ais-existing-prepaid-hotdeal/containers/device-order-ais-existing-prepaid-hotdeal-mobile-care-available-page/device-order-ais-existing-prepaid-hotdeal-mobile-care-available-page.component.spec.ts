import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent } from './device-order-ais-existing-prepaid-hotdeal-mobile-care-available-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
