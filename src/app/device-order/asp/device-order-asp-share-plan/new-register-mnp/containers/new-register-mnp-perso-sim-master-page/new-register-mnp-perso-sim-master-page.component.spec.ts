import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpPersoSimMasterPageComponent } from './new-register-mnp-perso-sim-master-page.component';

describe('NewRegisterMnpPersoSimMasterPageComponent', () => {
  let component: NewRegisterMnpPersoSimMasterPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpPersoSimMasterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpPersoSimMasterPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpPersoSimMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
