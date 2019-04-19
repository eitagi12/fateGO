import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpVerifyInstantSimPageComponent } from './device-order-ais-mnp-verify-instant-sim-page.component';

describe('DeviceOrderAisMnpVerifyInstantSimPageComponent', () => {
  let component: DeviceOrderAisMnpVerifyInstantSimPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpVerifyInstantSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpVerifyInstantSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpVerifyInstantSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
