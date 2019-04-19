import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpResultPageComponent } from './device-order-ais-mnp-result-page.component';

describe('DeviceOrderAisMnpResultPageComponent', () => {
  let component: DeviceOrderAisMnpResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
