import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressComponent, CustomerAddress } from './billing-address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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

  it('submitting a form emits a customer address', (done) => {
    component.zipCodes = ['11011', '11012'];
    component.customerAddressForm.controls['homeNo'].setValue('123');
    component.customerAddressForm.controls['province'].setValue('testProvice');
    component.customerAddressForm.controls['amphur'].setValue('testAmphur');
    component.customerAddressForm.controls['tumbol'].setValue('testTumbol');
    component.customerAddressForm.controls['zipCode'].setValue('11011');
    expect(component.customerAddressForm.valid).toBeTruthy();

    let customerAddress: CustomerAddress;
    component.completed.subscribe(value => {
      customerAddress = value;
      expect(customerAddress.homeNo).toBe('123');
      expect(customerAddress.province).toBe('testProvice');
      expect(customerAddress.amphur).toBe('testAmphur');
      expect(customerAddress.tumbol).toBe('testTumbol');
      expect(customerAddress.zipCode).toBe('11011');
      done();
    });
  });
});
