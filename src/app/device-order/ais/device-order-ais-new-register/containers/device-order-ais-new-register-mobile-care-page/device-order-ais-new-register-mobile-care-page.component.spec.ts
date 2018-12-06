import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterMobileCarePageComponent } from './device-order-ais-new-register-mobile-care-page.component';

describe('DeviceOrderAisNewRegisterMobileCarePageComponent', () => {
  let component: DeviceOrderAisNewRegisterMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
