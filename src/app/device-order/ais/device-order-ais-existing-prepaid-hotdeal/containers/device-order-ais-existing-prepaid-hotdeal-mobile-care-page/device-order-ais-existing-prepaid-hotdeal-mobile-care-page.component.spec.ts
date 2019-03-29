import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent } from './device-order-ais-existing-prepaid-hotdeal-mobile-care-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
