import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './device-only-ais-select-payment-and-receipt-information-page.component';
import { Builder } from 'protractor';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Type } from '@angular/compiler';
import { TypeModifier } from '@angular/compiler/src/output/output_ast';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { CustomerInformationService } from '../../services/customer-information.service';
import { HttpClient } from '../../../../../../../node_modules/@angular/common/http';

describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent;
  const fb: any = {};
  const router: any = {};
  const homeService: any = {};
  const apiRequestService: any = {};
  let transactionService: any;
  let priceOptionService: any;
  const createOrderService: any = {};
  const alertService: any = {};
  const  homeButtonService: any = {};
  const tokenService: any = {};
  const http: any = {};
  const customerInformationService: any = {};

  beforeEach(() => {
    transactionService = {
      load: jest.fn()
    };
    priceOptionService = {
      load: jest.fn()
    };
    tokenService = {
      getUser: jest.fn()
    };
    component = new DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent(
      router,
      homeService,
      apiRequestService,
      transactionService,
      priceOptionService,
      createOrderService,
      alertService,
      homeButtonService,
      customerInformationService,
      tokenService,
      http
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
