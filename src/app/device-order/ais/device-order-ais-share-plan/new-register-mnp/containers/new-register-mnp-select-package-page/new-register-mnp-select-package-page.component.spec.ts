import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSelectPackagePageComponent } from './new-register-mnp-select-package-page.component';

describe('NewRegisterMnpSelectPackagePageComponent', () => {
  let component: NewRegisterMnpSelectPackagePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
