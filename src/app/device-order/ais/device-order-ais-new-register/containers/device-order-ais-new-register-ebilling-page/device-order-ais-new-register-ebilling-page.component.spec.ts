import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterEbillingPageComponent } from './device-order-ais-new-register-ebilling-page.component';

describe('DeviceOrderAisNewRegisterEbillingPageComponent', () => {
  let component: DeviceOrderAisNewRegisterEbillingPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
