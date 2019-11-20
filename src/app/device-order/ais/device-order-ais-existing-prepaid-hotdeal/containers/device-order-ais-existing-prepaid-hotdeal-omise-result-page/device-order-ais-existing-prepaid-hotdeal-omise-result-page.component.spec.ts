import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealOmiseResultPageComponent } from './device-order-ais-existing-prepaid-hotdeal-omise-result-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealOmiseResultPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
