import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealResultPageComponent } from './device-order-ais-existing-prepaid-hotdeal-result-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealResultPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
