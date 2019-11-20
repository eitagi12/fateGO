import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingOmiseGeneratorPageComponent } from './device-order-ais-existing-omise-generator-page.component';

describe('DeviceOrderAisExistingOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
