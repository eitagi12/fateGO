import { DeviceOrderAspNewRegisterModule } from './device-order-asp-new-register.module';

describe('DeviceOrderAspNewRegisterModule', () => {
  let deviceOrderAspNewRegisterModule: DeviceOrderAspNewRegisterModule;

  beforeEach(() => {
    deviceOrderAspNewRegisterModule = new DeviceOrderAspNewRegisterModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAspNewRegisterModule).toBeTruthy();
  });
});
