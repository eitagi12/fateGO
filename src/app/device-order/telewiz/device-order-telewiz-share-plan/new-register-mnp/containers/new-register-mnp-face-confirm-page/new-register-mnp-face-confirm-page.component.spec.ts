import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpFaceConfirmPageComponent } from './new-register-mnp-face-confirm-page.component';

describe('NewRegisterMnpFaceConfirmPageComponent', () => {
  let component: NewRegisterMnpFaceConfirmPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpFaceConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpFaceConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
