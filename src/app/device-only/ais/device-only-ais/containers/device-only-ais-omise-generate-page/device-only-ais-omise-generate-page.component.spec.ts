import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisOmiseGeneratePageComponent } from './device-only-ais-omise-generate-page.component';

describe('DeviceOnlyAisOmiseGeneratePageComponent', () => {
  let component: DeviceOnlyAisOmiseGeneratePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisOmiseGeneratePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisOmiseGeneratePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisOmiseGeneratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
