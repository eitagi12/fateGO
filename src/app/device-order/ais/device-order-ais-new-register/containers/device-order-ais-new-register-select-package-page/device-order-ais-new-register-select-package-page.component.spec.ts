import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterSelectPackagePageComponent } from './device-order-ais-new-register-select-package-page.component';

describe('DeviceOrderAisNewRegisterSelectPackagePageComponent', () => {
  let component: DeviceOrderAisNewRegisterSelectPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
