import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BillingAddressComponent, CustomerAddress } from './billing-address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerInformationService } from '../../services/customer-information.service';

describe('BillingAddressComponent', () => {
  let component: BillingAddressComponent;
  let fixture: ComponentFixture<BillingAddressComponent>;

  setupTestBed({
    imports: [ ReactiveFormsModule],
    declarations: [ BillingAddressComponent],
    providers: [
      {
        provide : CustomerInformationService,
        useValue : {
          load: jest.fn(() => {
          })
        }
      }

    ]
  });

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

  it('should have error message for require validity when homeNo field empty', () => {
    const homeNo = component.customerAddressForm.controls['homeNo'];
    let errors = {};
    errors = homeNo.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('should have error message for pattern validity when homeNo field is wrong format', () => {
    const homeNo = component.customerAddressForm.controls['homeNo'];
    homeNo.setValue('test');
    let errors = {};
    errors = homeNo.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });

  it('submitting a form emits a customer address', fakeAsync(() => {
    component.zipCodes = ['11011', '11012'];
    component.customerAddressForm.controls['idCardNo'].setValue('1670300171423');
    component.customerAddressForm.controls['titleName'].setValue('นาย');
    component.customerAddressForm.controls['firstName'].setValue('John');
    component.customerAddressForm.controls['lastName'].setValue('Yoyo');
    component.customerAddressForm.controls['homeNo'].setValue('123');
    component.customerAddressForm.controls['province'].setValue('testProvice');
    component.customerAddressForm.controls['amphur'].setValue('testAmphur');
    component.customerAddressForm.controls['tumbol'].setValue('testTumbol');
    component.customerAddressForm.controls['zipCode'].setValue('11011');
    expect(component.customerAddressForm.valid).toBeTruthy();

    // Emit event to mother component
    let customerAddress: CustomerAddress;
    component.completed.subscribe(value => {
      customerAddress = value;
    });

    tick(750); // because set debounceTime to 750 in component
    expect(customerAddress.titleName).toBe('นาย');
    expect(customerAddress.firstName).toBe('John');
    expect(customerAddress.lastName).toBe('Yoyo');
    expect(customerAddress.homeNo).toBe('123');
    expect(customerAddress.province).toBe('testProvice');
    expect(customerAddress.amphur).toBe('testAmphur');
    expect(customerAddress.tumbol).toBe('testTumbol');
    expect(customerAddress.zipCode).toBe('11011');
  }));
});
