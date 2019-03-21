import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './device-only-ais-select-payment-and-receipt-information-page.component';
import { Builder } from 'protractor';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Type } from '@angular/compiler';
import { TypeModifier } from '@angular/compiler/src/output/output_ast';
import { HomeService } from 'mychannel-shared-libs';

describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent;
  const router: any = {};
  const homeService: any = {};
  const apiRequestService: any = {};
  let transactionService: any;

  beforeEach(() => {
    transactionService = {
      load: jest.fn()
    };
    component = new DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent(
      router,
      homeService,
      apiRequestService,
      transactionService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
