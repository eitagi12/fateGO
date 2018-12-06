import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterSelectNumberPageComponent } from './device-order-ais-new-register-select-number-page.component';

describe('DeviceOrderAisNewRegisterSelectNumberPageComponent', () => {
  let component: DeviceOrderAisNewRegisterSelectNumberPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterSelectNumberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterSelectNumberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterSelectNumberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
