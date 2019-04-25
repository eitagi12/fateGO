import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostOnTopPageComponent } from './device-order-ais-pre-to-post-on-top-page.component';

describe('DeviceOrderAisPreToPostOnTopPageComponent', () => {
  let component: DeviceOrderAisPreToPostOnTopPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostOnTopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostOnTopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostOnTopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
