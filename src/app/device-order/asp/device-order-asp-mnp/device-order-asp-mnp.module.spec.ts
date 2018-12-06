import { DeviceOrderAspMnpModule } from './device-order-asp-mnp.module';

describe('DeviceOrderAspMnpModule', () => {
  let deviceOrderAspMnpModule: DeviceOrderAspMnpModule;

  beforeEach(() => {
    deviceOrderAspMnpModule = new DeviceOrderAspMnpModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAspMnpModule).toBeTruthy();
  });
});
