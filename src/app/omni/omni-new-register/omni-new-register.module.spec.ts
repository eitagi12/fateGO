import { OmniNewRegisterRoutingModule } from './omni-new-register-routing.module';

describe('OmniNewRegisterModule', () => {
  let omniNewRegisterRoutingModule: OmniNewRegisterRoutingModule;

  beforeEach(() => {
    omniNewRegisterRoutingModule = new OmniNewRegisterRoutingModule();
  });

  it('should create an instance', () => {
    expect(omniNewRegisterRoutingModule).toBeTruthy();
  });
});
