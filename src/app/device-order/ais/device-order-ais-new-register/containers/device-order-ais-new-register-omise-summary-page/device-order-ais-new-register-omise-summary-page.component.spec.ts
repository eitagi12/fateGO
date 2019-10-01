import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterOmiseSummaryPageComponent } from './device-order-ais-new-register-omise-summary-page.component';

describe('DeviceOrderAisNewRegisterOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisNewRegisterOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
