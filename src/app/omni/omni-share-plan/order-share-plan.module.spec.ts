import { OmniSharePlanModule } from './order-share-plan.module';

describe('OmniSharePlanModule', () => {
  let orderSharePlanModule: OmniSharePlanModule;

  beforeEach(() => {
    orderSharePlanModule = new OmniSharePlanModule();
  });

  it('should create an instance', () => {
    expect(orderSharePlanModule).toBeTruthy();
  });
});
