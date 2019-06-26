import { DeviceOrderAisExistingGadgetModule } from './device-order-ais-existing-gadget.module';

describe('DeviceOrderAisExistingGadgetModule', () => {
  let deviceOrderAisExistingGadgetModule: DeviceOrderAisExistingGadgetModule;

  beforeEach(() => {
    deviceOrderAisExistingGadgetModule = new DeviceOrderAisExistingGadgetModule();
  });

  it('should create an instance', () => {
    expect(deviceOrderAisExistingGadgetModule).toBeTruthy();
  });
});
