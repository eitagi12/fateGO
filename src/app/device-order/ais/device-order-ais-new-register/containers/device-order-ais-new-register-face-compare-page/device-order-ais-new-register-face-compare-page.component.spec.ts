import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterFaceComparePageComponent } from './device-order-ais-new-register-face-compare-page.component';

describe('DeviceOrderAisNewRegisterFaceComparePageComponent', () => {
  let component: DeviceOrderAisNewRegisterFaceComparePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterFaceComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterFaceComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
