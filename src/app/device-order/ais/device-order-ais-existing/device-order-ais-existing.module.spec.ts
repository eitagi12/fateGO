import { DeviceOrderAisExistingModule } from './device-order-ais-existing.module';

describe('DeviceOrderAisExistingModule', () => {
  let deviceOrderAisExistingModule: DeviceOrderAisExistingModule;

  beforeEach(() => {
    deviceOrderAisExistingModule = new DeviceOrderAisExistingModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisExistingModule).toBeTruthy();
  });
});
