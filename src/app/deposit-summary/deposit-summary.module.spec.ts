import { DepositSummaryModule } from './deposit-summary.module';

describe('DepositSummaryModule', () => {
  let depositSummaryModule: DepositSummaryModule;

  beforeEach(() => {
    depositSummaryModule = new DepositSummaryModule();
  });

  it('should create an instance', () => {
    expect(depositSummaryModule).toBeTruthy();
  });
});
