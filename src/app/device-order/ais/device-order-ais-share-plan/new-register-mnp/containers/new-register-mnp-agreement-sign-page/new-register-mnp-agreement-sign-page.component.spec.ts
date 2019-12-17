import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpAgreementSignPageComponent } from './new-register-mnp-agreement-sign-page.component';

describe('NewRegisterMnpAgreementSignPageComponent', () => {
  let component: NewRegisterMnpAgreementSignPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
