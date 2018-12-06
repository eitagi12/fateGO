import { DeviceOrderModule } from './device-order.module';

describe('DeviceOrderModule', () => {
  let deviceOrderModule: DeviceOrderModule;

  beforeEach(() => {
    deviceOrderModule = new DeviceOrderModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderModule).toBeTruthy();
  });
});
