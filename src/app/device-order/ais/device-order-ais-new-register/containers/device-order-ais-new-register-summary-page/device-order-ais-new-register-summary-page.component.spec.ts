import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterSummaryPageComponent } from './device-order-ais-new-register-summary-page.component';

describe('DeviceOrderAisNewRegisterSummaryPageComponent', () => {
  let component: DeviceOrderAisNewRegisterSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
