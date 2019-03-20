import { DeviceOnlyAisCheckoutPaymentPageComponent } from './device-only-ais-checkout-payment-page.component';

describe('test checkout page', () => {
  let  component: DeviceOnlyAisCheckoutPaymentPageComponent;
  beforeEach(() => {
    component = new DeviceOnlyAisCheckoutPaymentPageComponent(
      {} as any,
      {} as any,
      {
        load: jest.fn()
      } as any,
      {
        load: jest.fn()
      } as any
    );
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
