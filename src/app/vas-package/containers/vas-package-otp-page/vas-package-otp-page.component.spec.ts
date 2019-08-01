import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageOtpPageComponent } from './vas-package-otp-page.component';

describe('VasPackageOtpPageComponent', () => {
  let component: VasPackageOtpPageComponent;
  let fixture: ComponentFixture<VasPackageOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
