import { DeviceOnlyKioskModule } from './device-only-kiosk.module';

describe('DeviceOnlyKioskModule', () => {
  let deviceOnlyKioskModule: DeviceOnlyKioskModule;

  beforeEach(() => {
    deviceOnlyKioskModule = new DeviceOnlyKioskModule();
  });

  it('should create an instance', () => {
    expect(deviceOnlyKioskModule).toBeTruthy();
  });
});
