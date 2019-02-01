import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingEapplicationPageComponent } from './device-order-ais-existing-eapplication-page.component';

describe('DeviceOrderAisExistingEapplicationPageComponent', () => {
  let component: DeviceOrderAisExistingEapplicationPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
