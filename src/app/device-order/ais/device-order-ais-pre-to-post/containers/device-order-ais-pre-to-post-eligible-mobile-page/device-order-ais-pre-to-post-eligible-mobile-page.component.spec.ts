import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostEligibleMobilePageComponent } from './device-order-ais-pre-to-post-eligible-mobile-page.component';

describe('DeviceOrderAisPreToPostEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisPreToPostEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
