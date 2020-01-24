import { BuyPremiumModule } from './buy-premium.module';

describe('BuyPremiumModule', () => {
  let buyPremiumModule: BuyPremiumModule;

  beforeEach(() => {
    buyPremiumModule = new BuyPremiumModule();
  });

  it('should create an instance', () => {
    expect(buyPremiumModule).toBeTruthy();
  });
});
