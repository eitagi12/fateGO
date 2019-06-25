import { BuyGadgetModule } from './buy-gadget.module';

describe('BuyGadgetModule', () => {
  let buyGadgetModule: BuyGadgetModule;

  beforeEach(() => {
    buyGadgetModule = new BuyGadgetModule();
  });

  it('should create an instance', () => {
    expect(buyGadgetModule).toBeTruthy();
  });
});
