import { TradeInModule } from './trade-in.module';

describe('TradeInModule', () => {
  let tradeInModule: TradeInModule;

  beforeEach(() => {
    tradeInModule = new TradeInModule();
  });

  it('should create an instance', () => {
    expect(tradeInModule).toBeTruthy();
  });
});
