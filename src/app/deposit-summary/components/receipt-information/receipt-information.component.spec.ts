
import { ReactiveFormsModule } from '@angular/forms';

import {  ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReceiptInformationComponent } from './receipt-information.component';
import { BillingAddressService } from '../../services/billing-address.service';
import { AlertService } from 'mychannel-shared-libs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'idCard'})
class MockIdCardNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}
describe('ReceiptInformationComponent', () => {
  let component: ReceiptInformationComponent;
  let fixture: ComponentFixture<ReceiptInformationComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule
    ],
    declarations: [ ReceiptInformationComponent, MockIdCardNoPipe ],
    providers: [
      HttpClient,
      HttpHandler,
      {
        provide : BillingAddressService,
        useValue: {
          getTitleName: jest.fn(() => {
            return Promise.resolve();
          }),
          getProvinces: jest.fn(() => {
            return Promise.resolve();
          }),
          getZipCodes: jest.fn(() => {
            return Promise.resolve();
          }),
          getLocationName: jest.fn(() => {
            return new Observable(() => {});
          }),
          getIsKeyInBillingAddress: jest.fn(),
          setIsKeyInBillingAddress: jest.fn()
        }
      },
      {
        provide : AlertService,
        useValue : {
          notify: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have error message for require validity when telNo field empty', () => {
    const telNo = component.receiptInfoForm.controls['telNo'];
    let errors = {};
    errors = telNo.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('should have error message for require validity when telNo field is wrong format', () => {
    component.receiptInfoForm.controls['telNo'].setValue('023456789');

    const telNo = component.receiptInfoForm.controls['telNo'];
    let errors = {};
    errors = telNo.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });

  // it('should have taxID equal receiptInfoForm taxID', () => {
  //   const value = { 'idCardNo' : '14799002554661'};
  //   component.onCompleted(value);
  //   component.completed.subscribe((receiptValue: any) => {
  //     expect(receiptValue.idCardNo).toBe('14799002554661');
  //   });
  // });

  it('submitting a form emits a receipt information', fakeAsync(() => {
    component.receiptInfoForm.controls['telNo'].setValue('0867876746');
    component.receiptInfoForm.controls['taxId'].setValue('01234567890123');
    expect(component.receiptInfoForm.valid).toBeTruthy();

  }));

  describe('searchCustomerInfo function', () => {

    // it('should have error message for require validity when mobileNo field is empty', () => {
    //   const mobileNo = component.searchByMobileNoForm.controls['mobileNo'];
    //   let errors = {};
    //   errors = mobileNo.errors || {};
    //   expect(errors['required']).toBeTruthy();
    // });

    // it('should have error message for require validity when mobileNo field is wrong format', () => {
    //   const mobileNo = component.searchByMobileNoForm.controls['mobileNo'];
    //   let errors = {};
    //   errors = mobileNo.errors || {};
    //   expect(errors['required']).toBeTruthy();
    // });

  });

});
