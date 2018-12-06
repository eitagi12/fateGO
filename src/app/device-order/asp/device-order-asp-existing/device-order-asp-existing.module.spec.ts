import { DeviceOrderAspExistingModule } from './device-order-asp-existing.module';

describe('DeviceOrderAspExistingModule', () => {
  let deviceOrderAspExistingModule: DeviceOrderAspExistingModule;

  beforeEach(() => {
    deviceOrderAspExistingModule = new DeviceOrderAspExistingModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAspExistingModule).toBeTruthy();
  });
});
