import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpEapplicationPageComponent } from './device-order-ais-mnp-eapplication-page.component';

describe('DeviceOrderAisMnpEapplicationPageComponent', () => {
  let component: DeviceOrderAisMnpEapplicationPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
