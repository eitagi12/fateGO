import { OmniModule } from './omni.module';

describe('OmniModule', () => {
  let omniModule: OmniModule;

  beforeEach(() => {
    omniModule = new OmniModule();
  });

  it('should create an instance', () => {
    expect(OmniModule).toBeTruthy();
  });
});
