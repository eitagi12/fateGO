import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostSelectPackagePageComponent } from './device-order-ais-pre-to-post-select-package-page.component';

describe('DeviceOrderAisPreToPostSelectPackagePageComponent', () => {
  let component: DeviceOrderAisPreToPostSelectPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
