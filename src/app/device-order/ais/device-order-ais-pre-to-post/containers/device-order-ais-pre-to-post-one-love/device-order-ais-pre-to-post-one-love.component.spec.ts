import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostOneLoveComponent } from './device-order-ais-pre-to-post-one-love.component';

describe('DeviceOrderAisPreToPostOneLoveComponent', () => {
  let component: DeviceOrderAisPreToPostOneLoveComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostOneLoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostOneLoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostOneLoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
