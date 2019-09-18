import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpEbillingAddressPageComponent } from './new-register-mnp-ebilling-address-page.component';

describe('NewRegisterMnpEbillingAddressPageComponent', () => {
  let component: NewRegisterMnpEbillingAddressPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
