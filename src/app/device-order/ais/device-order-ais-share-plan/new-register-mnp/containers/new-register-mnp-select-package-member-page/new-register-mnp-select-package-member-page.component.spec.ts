import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSelectPackageMemberPageComponent } from './new-register-mnp-select-package-member-page.component';

describe('NewRegisterMnpSelectPackageMemberPageComponent', () => {
  let component: NewRegisterMnpSelectPackageMemberPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpSelectPackageMemberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSelectPackageMemberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSelectPackageMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
