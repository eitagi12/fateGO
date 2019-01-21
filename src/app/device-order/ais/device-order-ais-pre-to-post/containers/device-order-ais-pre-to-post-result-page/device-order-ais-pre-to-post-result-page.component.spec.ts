import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostResultPageComponent } from './device-order-ais-pre-to-post-result-page.component';

describe('DeviceOrderAisPreToPostResultPageComponent', () => {
  let component: DeviceOrderAisPreToPostResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
