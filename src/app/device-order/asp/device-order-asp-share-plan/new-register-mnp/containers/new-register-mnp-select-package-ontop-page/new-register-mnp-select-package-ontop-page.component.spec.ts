import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSelectPackageOntopPageComponent } from './new-register-mnp-select-package-ontop-page.component';

describe('NewRegisterMnpSelectPackageOntopPageComponent', () => {
  let component: NewRegisterMnpSelectPackageOntopPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpSelectPackageOntopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSelectPackageOntopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSelectPackageOntopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
