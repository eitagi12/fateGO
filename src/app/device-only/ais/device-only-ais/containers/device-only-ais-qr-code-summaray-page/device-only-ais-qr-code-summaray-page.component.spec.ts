import { DeviceOnlyAisQrCodeSummarayPageComponent } from './device-only-ais-qr-code-summaray-page.component';
import { ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';

describe('DeviceOnlyAisQrCodeSummarayPageComponent', () => {
  let component: DeviceOnlyAisQrCodeSummarayPageComponent;
  let router;
  let homeService;

  beforeEach(() => {
    router = {
      navigate: jest.fn()
    };

    homeService = {
      goToHome: jest.fn()
    };

    component = new DeviceOnlyAisQrCodeSummarayPageComponent(
      router,
      homeService
    );
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('onBack', () => {
    it('should route navigate to ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE', () => {
      component.onBack();
      expect(router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE]);
    });
  });

  describe('onNext', () => {
    it('should route to navigate to ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE', () => {
      component.onNext();
      expect(router.navigate).toHaveBeenCalledWith([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
    });
  });

});
