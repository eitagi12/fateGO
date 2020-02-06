import { OmniSharedModule } from './omni-shared.module';

describe('OmniSharedModule', () => {
  let omniSharedModule: OmniSharedModule;

  beforeEach(() => {
    omniSharedModule = new OmniSharedModule();
  });

  it('should create an instance', () => {
    expect(omniSharedModule).toBeTruthy();
  });
});
