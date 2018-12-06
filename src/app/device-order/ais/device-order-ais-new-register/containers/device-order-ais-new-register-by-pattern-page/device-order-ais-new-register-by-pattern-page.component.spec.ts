import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterByPatternPageComponent } from './device-order-ais-new-register-by-pattern-page.component';

describe('DeviceOrderAisNewRegisterByPatternPageComponent', () => {
  let component: DeviceOrderAisNewRegisterByPatternPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterByPatternPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterByPatternPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterByPatternPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
