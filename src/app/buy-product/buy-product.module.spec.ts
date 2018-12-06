import { BuyProductModule } from './buy-product.module';

describe('BuyProductModule', () => {
  let buyProductModule: BuyProductModule;

  beforeEach(() => {
    buyProductModule = new BuyProductModule();
  });

  it('should create an instance', () => {
    expect(buyProductModule).toBeTruthy();
  });
});
