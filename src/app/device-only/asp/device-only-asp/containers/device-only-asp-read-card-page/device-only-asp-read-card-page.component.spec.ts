/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DeviceOnlyAspReadCardPageComponent } from './device-only-asp-read-card-page.component';

describe('DeviceOnlyAspReadCardPageComponent', () => {
  let component: DeviceOnlyAspReadCardPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspReadCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAspReadCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspReadCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
