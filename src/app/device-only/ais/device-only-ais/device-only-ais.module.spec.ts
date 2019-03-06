import { DeviceOnlyAisModule } from './device-only-ais.module';

describe('DeviceOnlyAisModule', () => {
  let deviceOnlyAisModule: DeviceOnlyAisModule;

  beforeEach(() => {
    deviceOnlyAisModule = new DeviceOnlyAisModule();
  });

  it('should create an instance', () => {
    expect(deviceOnlyAisModule).toBeTruthy();
  });
});
