import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderComponent } from './device-order.component';

describe('DeviceOrderComponent', () => {
  let component: DeviceOrderComponent;
  let fixture: ComponentFixture<DeviceOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
