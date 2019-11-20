import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpOmiseGeneratorPageComponent } from './device-order-ais-mnp-omise-generator-page.component';

describe('DeviceOrderAisMnpOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisMnpOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
