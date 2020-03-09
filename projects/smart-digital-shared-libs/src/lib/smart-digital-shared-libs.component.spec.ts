import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartDigitalSharedLibsComponent } from './smart-digital-shared-libs.component';

describe('SmartDigitalSharedLibsComponent', () => {
  let component: SmartDigitalSharedLibsComponent;
  let fixture: ComponentFixture<SmartDigitalSharedLibsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartDigitalSharedLibsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartDigitalSharedLibsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
