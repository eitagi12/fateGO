import { DeviceOnlyModule } from './device-only.module';

describe('DeviceOnlyModule', () => {
  let deviceOnlyModule: DeviceOnlyModule;

  beforeEach(() => {
    deviceOnlyModule = new DeviceOnlyModule();
  });

  it('should create an instance', () => {
    expect(deviceOnlyModule).toBeTruthy();
  });
});
