import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageLoginWithPinPageComponent } from './vas-package-login-with-pin-page.component';

describe('VasPackageLoginWithPinPageComponent', () => {
  let component: VasPackageLoginWithPinPageComponent;
  let fixture: ComponentFixture<VasPackageLoginWithPinPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageLoginWithPinPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageLoginWithPinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
