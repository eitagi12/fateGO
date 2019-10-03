import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpOmiseResultPageComponent } from './device-order-ais-mnp-omise-result-page.component';

describe('DeviceOrderAisMnpOmiseResultPageComponent', () => {
  let component: DeviceOrderAisMnpOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
