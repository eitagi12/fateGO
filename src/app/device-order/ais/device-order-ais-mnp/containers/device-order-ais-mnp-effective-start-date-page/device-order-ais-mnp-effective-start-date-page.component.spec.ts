import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpEffectiveStartDatePageComponent } from './device-order-ais-mnp-effective-start-date-page.component';

describe('DeviceOrderAisMnpEffectiveStartDatePageComponent', () => {
  let component: DeviceOrderAisMnpEffectiveStartDatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpEffectiveStartDatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpEffectiveStartDatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpEffectiveStartDatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
