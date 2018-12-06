import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterResultPageComponent } from './device-order-ais-new-register-result-page.component';

describe('DeviceOrderAisNewRegisterResultPageComponent', () => {
  let component: DeviceOrderAisNewRegisterResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
