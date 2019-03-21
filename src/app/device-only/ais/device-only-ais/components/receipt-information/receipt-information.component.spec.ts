import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReceiptInformationComponent, ReceiptInfo } from './receipt-information.component';
import { BillingAddressService } from '../../services/billing-address.service';

describe('ReceiptInformationComponent', () => {
  let component: ReceiptInformationComponent;
  let fixture: ComponentFixture<ReceiptInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ReceiptInformationComponent ],
      providers: [
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
            })
          }
        },
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();
  }));

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

  it('submitting a form emits a receipt information', fakeAsync(() => {
    component.receiptInfoForm.controls['telNo'].setValue('0867876746');
    expect(component.receiptInfoForm.valid).toBeTruthy();

    // Emit event to mother component
    let receiptInfo: ReceiptInfo;
    component.completed.subscribe(value => {
      receiptInfo = value;
    });

    tick(750); // because set debounceTime to 750 in component
    expect(receiptInfo.telNo).toBe('0867876746');
  }));
});