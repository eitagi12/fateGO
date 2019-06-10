import { DeviceOnlyAspModule } from './device-only-asp.module';

describe('DeviceOnlyModule', () => {
  let deviceOnlyAspModule: DeviceOnlyAspModule;

  beforeEach(() => {
    deviceOnlyAspModule = new DeviceOnlyAspModule();
  });

  it('should create an instance', () => {
    expect(deviceOnlyAspModule).toBeTruthy();
  });
});
