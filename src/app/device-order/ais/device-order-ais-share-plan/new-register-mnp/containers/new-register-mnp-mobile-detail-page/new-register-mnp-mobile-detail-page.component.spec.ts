import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpMobileDetailPageComponent } from './new-register-mnp-mobile-detail-page.component';

describe('NewRegisterMnpMobileDetailPageComponent', () => {
  let component: NewRegisterMnpMobileDetailPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpMobileDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpMobileDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpMobileDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
