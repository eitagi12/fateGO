import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyComponent } from './device-only.component';

describe('DeviceOnlyComponent', () => {
  let component: DeviceOnlyComponent;
  let fixture: ComponentFixture<DeviceOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
