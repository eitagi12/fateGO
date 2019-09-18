import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpPersoSimPageComponent } from './new-register-mnp-perso-sim-page.component';

describe('NewRegisterMnpPersoSimPageComponent', () => {
  let component: NewRegisterMnpPersoSimPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpPersoSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpPersoSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
