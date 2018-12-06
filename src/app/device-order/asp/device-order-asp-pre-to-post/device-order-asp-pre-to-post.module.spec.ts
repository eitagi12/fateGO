import { DeviceOrderAspPreToPostModule } from './device-order-asp-pre-to-post.module';

describe('DeviceOrderAspPreToPostModule', () => {
  let deviceOrderAspPreToPostModule: DeviceOrderAspPreToPostModule;

  beforeEach(() => {
    deviceOrderAspPreToPostModule = new DeviceOrderAspPreToPostModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAspPreToPostModule).toBeTruthy();
  });
});
