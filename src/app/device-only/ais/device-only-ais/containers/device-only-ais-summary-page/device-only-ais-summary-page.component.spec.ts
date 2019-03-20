import { DeviceOnlyAisSummaryPageComponent } from './device-only-ais-summary-page.component';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';

describe('DeviceOnlyAisSummaryPageComponent', () => {
  let component: DeviceOnlyAisSummaryPageComponent;
  let router;
  let homeService;

  beforeEach(() => {
    router = {
      navigate: jest.fn()
    };
    homeService = {
      goToHome: jest.fn()
    };
    component = new DeviceOnlyAisSummaryPageComponent(
      router,
      homeService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBack', () => {
    it('should route navigate to ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE', () => {
      component.onBack();
      expect(router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
    });
  });

  describe('onNext', () => {
    it('should route to navigate to ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE', () => {
      component.onNext();
      expect(router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE]);
    });
  });
});
