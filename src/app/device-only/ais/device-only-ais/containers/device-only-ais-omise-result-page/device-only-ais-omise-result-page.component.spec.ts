import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisOmiseResultPageComponent } from './device-only-ais-omise-result-page.component';

describe('DeviceOnlyAisOmiseResultPageComponent', () => {
  let component: DeviceOnlyAisOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
