import { DeviceOnlyAisKeyInQueuePageComponent } from './device-only-ais-key-in-queue-page.component';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';

describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisKeyInQueuePageComponent;
  beforeEach(() => {
    component = new DeviceOnlyAisKeyInQueuePageComponent(
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
