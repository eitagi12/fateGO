
import { ReactiveFormsModule } from '@angular/forms';

import {  ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReceiptInformationComponent, ReceiptInfo } from './receipt-information.component';
import { BillingAddressService } from '../../services/billing-address.service';
import { AlertService } from 'mychannel-shared-libs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('ReceiptInformationComponent', () => {
  let component: ReceiptInformationComponent;
  let fixture: ComponentFixture<ReceiptInformationComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule
    ],
    declarations: [ ReceiptInformationComponent ],
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
          })
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
    component.receiptInfo = {} as ReceiptInfo;
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

  it('should have taxID equal receiptInfoForm taxID', () => {
    const value = { 'idCardNo' : '14799002554661'};
    component.onCompleted(value);
    component.completed.subscribe((receiptValue: any) => {
      expect(receiptValue.idCardNo).toBe('14799002554661');
    });
  });

  it('submitting a form emits a receipt information', fakeAsync(() => {
    component.receiptInfoForm.controls['telNo'].setValue('0867876746');
    expect(component.receiptInfoForm.valid).toBeTruthy();

    // Emit event to mother component
    let receiptInfo: ReceiptInfo;
    component.completed.subscribe(value => {
      receiptInfo = value.receiptInfo;
    });

    tick(750); // because set debounceTime to 750 in component
    expect(receiptInfo.telNo).toBe('0867876746');
  }));

  describe('searchCustomerInfo function', () => {

    it('should have error message for require validity when mobileNo field is empty', () => {
      const mobileNo = component.searchByMobileNoForm.controls['mobileNo'];
      let errors = {};
      errors = mobileNo.errors || {};
      expect(errors['required']).toBeTruthy();
    });

    it('should have error message for require validity when mobileNo field is wrong format', () => {
      const mobileNo = component.searchByMobileNoForm.controls['mobileNo'];
      let errors = {};
      errors = mobileNo.errors || {};
      expect(errors['required']).toBeTruthy();
    });

  });

});
