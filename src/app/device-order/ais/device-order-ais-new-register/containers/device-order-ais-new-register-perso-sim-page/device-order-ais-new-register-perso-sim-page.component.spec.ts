import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterPersoSimPageComponent } from './device-order-ais-new-register-perso-sim-page.component';

describe('DeviceOrderAisNewRegisterPersoSimPageComponent', () => {
  let component: DeviceOrderAisNewRegisterPersoSimPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterPersoSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterPersoSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
