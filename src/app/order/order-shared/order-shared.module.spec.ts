import { OrderSharedModule } from './order-shared.module';

describe('OrderSharedModule', () => {
  let orderSharedModule: OrderSharedModule;

  beforeEach(() => {
    orderSharedModule = new OrderSharedModule();
  });

  it('should create an instance', () => {
    expect(orderSharedModule).toBeTruthy();
  });
});
