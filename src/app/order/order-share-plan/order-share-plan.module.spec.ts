import { OrderSharePlanModule } from './order-share-plan.module';

describe('OrderSharePlanModule', () => {
  let orderSharePlanModule: OrderSharePlanModule;

  beforeEach(() => {
    orderSharePlanModule = new OrderSharePlanModule();
  });

  it('should create an instance', () => {
    expect(orderSharePlanModule).toBeTruthy();
  });
});
