import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpByPatternPageComponent } from './device-order-ais-mnp-by-pattern-page.component';

describe('DeviceOrderAisMnpByPatternPageComponent', () => {
  let component: DeviceOrderAisMnpByPatternPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpByPatternPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpByPatternPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpByPatternPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
