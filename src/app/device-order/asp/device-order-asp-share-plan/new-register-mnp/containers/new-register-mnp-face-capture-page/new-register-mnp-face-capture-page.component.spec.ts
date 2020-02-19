import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpFaceCapturePageComponent } from './new-register-mnp-face-capture-page.component';

describe('NewRegisterMnpFaceCapturePageComponent', () => {
  let component: NewRegisterMnpFaceCapturePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpFaceCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpFaceCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
