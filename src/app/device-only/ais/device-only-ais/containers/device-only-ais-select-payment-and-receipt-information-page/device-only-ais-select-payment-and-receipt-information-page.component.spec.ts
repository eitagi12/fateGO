import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './device-only-ais-select-payment-and-receipt-information-page.component';

describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent;
  const router: any = {};
  const homeService: any = {};
  const apiRequestService: any = {};
  let transactionService: any;
  let priceOptionService: any;
  const createOrderService: any = {};
  const alertService: any = {};
  const  homeButtonService: any = {};
  let tokenService: any = {};

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
      tokenService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
