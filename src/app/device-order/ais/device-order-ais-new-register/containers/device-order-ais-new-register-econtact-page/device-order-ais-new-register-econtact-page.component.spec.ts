import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterEcontactPageComponent } from './device-order-ais-new-register-econtact-page.component';

describe('DeviceOrderAisNewRegisterEcontactPageComponent', () => {
  let component: DeviceOrderAisNewRegisterEcontactPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterEcontactPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterEcontactPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterEcontactPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
