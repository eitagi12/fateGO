import { DeviceOrderAisMnpModule } from './device-order-ais-mnp.module';

describe('DeviceOrderAisMnpModule', () => {
  let deviceOrderAisMnpModule: DeviceOrderAisMnpModule;

  beforeEach(() => {
    deviceOrderAisMnpModule = new DeviceOrderAisMnpModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisMnpModule).toBeTruthy();
  });
});
