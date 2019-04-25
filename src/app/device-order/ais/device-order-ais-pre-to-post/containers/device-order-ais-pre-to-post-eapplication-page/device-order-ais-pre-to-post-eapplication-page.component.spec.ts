import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostEapplicationPageComponent } from './device-order-ais-pre-to-post-eapplication-page.component';

describe('DeviceOrderAisPreToPostEapplicationPageComponent', () => {
  let component: DeviceOrderAisPreToPostEapplicationPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
