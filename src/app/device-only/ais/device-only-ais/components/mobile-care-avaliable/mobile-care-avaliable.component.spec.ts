import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MobileCareAvaliableComponent } from './mobile-care-avaliable.component';

describe('MobileCareAvaliableComponent', () => {
  let component: MobileCareAvaliableComponent;
  let fixture: ComponentFixture<MobileCareAvaliableComponent>;

  setupTestBed({
    imports: [ RouterTestingModule ],
    declarations: [ MobileCareAvaliableComponent ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCareAvaliableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
