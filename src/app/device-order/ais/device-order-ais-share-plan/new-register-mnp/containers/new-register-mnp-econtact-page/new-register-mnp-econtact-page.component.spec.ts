import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpEcontactPageComponent } from './new-register-mnp-econtact-page.component';

describe('NewRegisterMnpEcontactPageComponent', () => {
  let component: NewRegisterMnpEcontactPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpEcontactPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpEcontactPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpEcontactPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
