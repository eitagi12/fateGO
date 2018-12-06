import { DeviceOrderAisNewRegisterModule } from './device-order-ais-new-register.module';

describe('DeviceOrderAisNewRegisterModule', () => {
  let deviceOrderAisNewRegisterModule: DeviceOrderAisNewRegisterModule;

  beforeEach(() => {
    deviceOrderAisNewRegisterModule = new DeviceOrderAisNewRegisterModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisNewRegisterModule).toBeTruthy();
  });
});
