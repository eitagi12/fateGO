import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostAgreementSignPageComponent } from './device-order-ais-pre-to-post-agreement-sign-page.component';

describe('DeviceOrderAisPreToPostAgreementSignPageComponent', () => {
  let component: DeviceOrderAisPreToPostAgreementSignPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
