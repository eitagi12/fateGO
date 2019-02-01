import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingMobileCareAvailablePageComponent } from './device-order-ais-existing-mobile-care-available-page.component';

describe('DeviceOrderAisExistingMobileCareAvailablePageComponent', () => {
  let component: DeviceOrderAisExistingMobileCareAvailablePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingMobileCareAvailablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingMobileCareAvailablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingMobileCareAvailablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
