
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './device-only-ais-qr-code-queue-page.component';

describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisQrCodeQueuePageComponent;
  const router: any = {
    navigate: jest.fn()
  };
  const homeService: any = {};
  const transactionService: any = {
    load: jest.fn()
  };

  beforeEach(() => {
    component = new DeviceOnlyAisQrCodeQueuePageComponent(
      router,
      homeService,
      transactionService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test onNext', () => {
    it('go to page queue', () => {
      component.onNext();
      expect(router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
    });
  });

});
