import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostOmiseResultPageComponent } from './device-order-ais-pre-to-post-omise-result-page.component';

describe('DeviceOrderAisPreToPostOmiseResultPageComponent', () => {
  let component: DeviceOrderAisPreToPostOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
