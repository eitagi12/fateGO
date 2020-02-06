import { OmniBlcokChainModule } from './omni-blcok-chain.module';

describe('OmniBlcokChainModule', () => {
  let omniBlcokChainModule: OmniBlcokChainModule;

  beforeEach(() => {
    omniBlcokChainModule = new OmniBlcokChainModule();
  });

  it('should create an instance', () => {
    expect(omniBlcokChainModule).toBeTruthy();
  });
});
