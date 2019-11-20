import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealOmiseGeneratorPageComponent } from './device-order-ais-existing-prepaid-hotdeal-omise-generator-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
