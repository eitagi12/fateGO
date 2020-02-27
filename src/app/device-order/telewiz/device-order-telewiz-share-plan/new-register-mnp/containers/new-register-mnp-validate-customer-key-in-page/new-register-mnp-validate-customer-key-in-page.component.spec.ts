import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpValidateCustomerKeyInPageComponent } from './new-register-mnp-validate-customer-key-in-page.component';

describe('NewRegisterMnpValidateCustomerKeyInPageComponent', () => {
  let component: NewRegisterMnpValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
