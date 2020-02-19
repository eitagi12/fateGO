import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpEbillingPageComponent } from './new-register-mnp-ebilling-page.component';

describe('NewRegisterMnpEbillingPageComponent', () => {
  let component: NewRegisterMnpEbillingPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
