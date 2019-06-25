import { DeviceOrderAisExistingAccessoriesModule } from './device-order-ais-existing-accessories.module';

describe('DeviceOrderAisExistingAccessoriesModule', () => {
  let deviceOrderAisExistingAccessoriesModule: DeviceOrderAisExistingAccessoriesModule;

  beforeEach(() => {
    deviceOrderAisExistingAccessoriesModule = new DeviceOrderAisExistingAccessoriesModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisExistingAccessoriesModule).toBeTruthy();
  });
});
