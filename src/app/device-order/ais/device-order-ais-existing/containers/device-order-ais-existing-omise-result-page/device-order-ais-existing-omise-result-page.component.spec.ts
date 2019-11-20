import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingOmiseResultPageComponent } from './device-order-ais-existing-omise-result-page.component';

describe('DeviceOrderAisExistingOmiseResultPageComponent', () => {
  let component: DeviceOrderAisExistingOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
