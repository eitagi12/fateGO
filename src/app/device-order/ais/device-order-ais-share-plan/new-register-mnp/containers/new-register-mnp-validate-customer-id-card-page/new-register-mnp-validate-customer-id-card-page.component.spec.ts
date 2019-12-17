import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpValidateCustomerIdCardPageComponent } from './new-register-mnp-validate-customer-id-card-page.component';

describe('NewRegisterMnpValidateCustomerIdCardPageComponent', () => {
  let component: NewRegisterMnpValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
