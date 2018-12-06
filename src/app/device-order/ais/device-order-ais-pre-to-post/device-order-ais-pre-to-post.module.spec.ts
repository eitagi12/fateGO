import { DeviceOrderAisPreToPostModule } from './device-order-ais-pre-to-post.module';

describe('DeviceOrderAisPreToPostModule', () => {
  let deviceOrderAisPreToPostModule: DeviceOrderAisPreToPostModule;

  beforeEach(() => {
    deviceOrderAisPreToPostModule = new DeviceOrderAisPreToPostModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisPreToPostModule).toBeTruthy();
  });
});
