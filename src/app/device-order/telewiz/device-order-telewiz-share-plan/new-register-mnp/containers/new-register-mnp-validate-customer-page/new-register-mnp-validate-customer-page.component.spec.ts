import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpValidateCustomerPageComponent } from './new-register-mnp-validate-customer-page.component';

describe('NewRegisterMnpValidateCustomerPageComponent', () => {
  let component: NewRegisterMnpValidateCustomerPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
