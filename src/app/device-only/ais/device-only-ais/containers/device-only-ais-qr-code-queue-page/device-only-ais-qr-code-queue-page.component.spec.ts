
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './device-only-ais-qr-code-queue-page.component';
import stringify from 'fast-json-stable-stringify';
import { resolve } from 'url';
describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisQrCodeQueuePageComponent;
  const router: any = {
    navigate: jest.fn()
  };
  const queueFrom: any = {};
  const homeService: any = {};
  const transactionService: any = {
    load: jest.fn(() => {
      return {
        data: {
          queue: {
            queueNo: 'D003'
          }
        }
      };
    })
  };
  const priceOptionService: any = {
    load: jest.fn()
  };

  const homeButtonService: any = {};
  const pageLoadingService: any = {
    openLoading: jest.fn()
  };
  const sharedTransactionService: any = {};
  const createOrderService: any = {};

  const queueService: any = {
    autoGetQueue: jest.fn(() => {
      return Promise.resolve();
      // const data:object = {
      //   mobileNo: '0999999999'
      // };
      // resolve(data,'to')
    })
  };
  const tokenService: any = {
    getUser: jest.fn()
  };

  beforeEach(() => {
    component = new DeviceOnlyAisQrCodeQueuePageComponent(
      queueFrom,
      router,
      homeService,
      transactionService,
      priceOptionService,
      homeButtonService,
      pageLoadingService,
      sharedTransactionService,
      createOrderService,
      queueService,
      tokenService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('test onNext', () => {
  //   it('Openloading to Have BeenCalled ', () => {
  //     // expect(router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
  //     component.onNext();
  //     expect(priceOptionService.openLoading).toHaveBeenCalled();
  //     // expect(queueService.autoGetQueue(mobileNo.value)).toEqual(2);
  //   });
  // });

});
