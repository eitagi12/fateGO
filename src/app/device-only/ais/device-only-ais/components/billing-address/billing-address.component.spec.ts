import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressComponent } from './billing-address.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('BillingAddressComponent', () => {
  let component: BillingAddressComponent;
  let fixture: ComponentFixture<BillingAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule],
      declarations: [ BillingAddressComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not valid when homeNo filed empty', () => {
    const homeNo = component.customerAddressForm.controls['homeNo'];
    expect(homeNo.valid).toBeFalsy();
  });

  it('should have error message for require valididy when homeNo filed empty', () => {
    const homeNo = component.customerAddressForm.controls['homeNo'];
    let errors = {};
    errors = homeNo.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('should have error message for pattern valididy when homeNo filed is wrong format', () => {
    const homeNo = component.customerAddressForm.controls['homeNo'];
    homeNo.setValue('test');
    let errors = {};
    errors = homeNo.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });
});
