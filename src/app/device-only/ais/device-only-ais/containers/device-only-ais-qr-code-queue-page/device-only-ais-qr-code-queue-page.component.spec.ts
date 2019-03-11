
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './device-only-ais-qr-code-queue-page.component';

describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisQrCodeQueuePageComponent;
  beforeEach(() => {
    component = new DeviceOnlyAisQrCodeQueuePageComponent(
      {navigate: jest.fn()}
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test onNext', () => {
    it('go to page queue', () => {
      component.onNext();
      expect(component.router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
    });
  });

});
