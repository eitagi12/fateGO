import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSelectPackageMemberComponent } from './new-register-mnp-select-package-member.component';

describe('NewRegisterMnpSelectPackageMemberComponent', () => {
  let component: NewRegisterMnpSelectPackageMemberComponent;
  let fixture: ComponentFixture<NewRegisterMnpSelectPackageMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSelectPackageMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSelectPackageMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
