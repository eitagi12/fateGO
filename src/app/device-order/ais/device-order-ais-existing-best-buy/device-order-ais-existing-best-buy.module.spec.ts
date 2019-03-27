import { DeviceOrderAisExistingBestBuyModule } from './device-order-ais-existing-best-buy.module';

describe('DeviceOrderAisExistingBestBuyModule', () => {
  let deviceOrderAisExistingBestBuyModule: DeviceOrderAisExistingBestBuyModule;

  beforeEach(() => {
    deviceOrderAisExistingBestBuyModule = new DeviceOrderAisExistingBestBuyModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisExistingBestBuyModule).toBeTruthy();
  });
});
