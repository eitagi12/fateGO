import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisOmiseGeneratorPageComponent } from './device-only-ais-omise-generator-page.component';

describe('DeviceOnlyAisOmiseGeneratorPageComponent', () => {
  let component: DeviceOnlyAisOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
