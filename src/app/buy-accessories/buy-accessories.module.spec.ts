import { BuyAccessoriesModule } from './buy-accessories.module';

describe('BuyAccessoriesModule', () => {
  let buyAccessoriesModule: BuyAccessoriesModule;

  beforeEach(() => {
    buyAccessoriesModule = new BuyAccessoriesModule();
  });

  it('should create an instance', () => {
    expect(buyAccessoriesModule).toBeTruthy();
  });
});
