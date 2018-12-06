import { OrderPreToPostModule } from './order-pre-to-post.module';

describe('OrderPreToPostModule', () => {
  let orderPreToPostModule: OrderPreToPostModule;

  beforeEach(() => {
    orderPreToPostModule = new OrderPreToPostModule();
  });

  it('should create an instance', () => {
    expect(orderPreToPostModule).toBeTruthy();
  });
});
