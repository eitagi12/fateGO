import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingResultPageComponent } from './device-order-ais-existing-result-page.component';

describe('DeviceOrderAisExistingResultPageComponent', () => {
  let component: DeviceOrderAisExistingResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
