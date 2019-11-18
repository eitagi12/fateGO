import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostOmiseGeneratorPageComponent } from './device-order-ais-pre-to-post-omise-generator-page.component';

describe('DeviceOrderAisPreToPostOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisPreToPostOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
