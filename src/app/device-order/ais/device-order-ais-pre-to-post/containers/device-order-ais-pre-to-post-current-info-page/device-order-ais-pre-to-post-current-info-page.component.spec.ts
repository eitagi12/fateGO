import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostCurrentInfoPageComponent } from './device-order-ais-pre-to-post-current-info-page.component';

describe('DeviceOrderAisPreToPostCurrentInfoPageComponent', () => {
  let component: DeviceOrderAisPreToPostCurrentInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostCurrentInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostCurrentInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostCurrentInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
