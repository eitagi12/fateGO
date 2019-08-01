import { DeviceOrderAisDeviceModule } from './device-order-ais-device.module';

describe('DeviceOrderAisDeviceModule', () => {
  let deviceOrderAisDeviceModule: DeviceOrderAisDeviceModule;

  beforeEach(() => {
    deviceOrderAisDeviceModule = new DeviceOrderAisDeviceModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisDeviceModule).toBeTruthy();
  });
});
