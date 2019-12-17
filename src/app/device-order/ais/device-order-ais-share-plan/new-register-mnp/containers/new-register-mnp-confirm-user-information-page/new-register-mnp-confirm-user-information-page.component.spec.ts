import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpConfirmUserInformationPageComponent } from './new-register-mnp-confirm-user-information-page.component';

describe('NewRegisterMnpConfirmUserInformationPageComponent', () => {
  let component: NewRegisterMnpConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
