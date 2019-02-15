import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostMobileCarePageComponent } from './device-order-ais-pre-to-post-mobile-care-page.component';

describe('DeviceOrderAisPreToPostMobileCarePageComponent', () => {
  let component: DeviceOrderAisPreToPostMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
