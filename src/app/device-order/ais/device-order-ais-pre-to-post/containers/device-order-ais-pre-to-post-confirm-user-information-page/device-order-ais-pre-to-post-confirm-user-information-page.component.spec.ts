import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostConfirmUserInformationPageComponent } from './device-order-ais-pre-to-post-confirm-user-information-page.component';

describe('DeviceOrderAisPreToPostConfirmUserInformationPageComponent', () => {
  let component: DeviceOrderAisPreToPostConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
