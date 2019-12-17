import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpPersoSimMemberPageComponent } from './new-register-mnp-perso-sim-member-page.component';

describe('NewRegisterMnpPersoSimMemberPageComponent', () => {
  let component: NewRegisterMnpPersoSimMemberPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpPersoSimMemberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpPersoSimMemberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpPersoSimMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
