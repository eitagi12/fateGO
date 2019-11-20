import { OrderBlcokChainModule } from './order-blcok-chain.module';

describe('OrderBlcokChainModule', () => {
  let orderBlcokChainModule: OrderBlcokChainModule;

  beforeEach(() => {
    orderBlcokChainModule = new OrderBlcokChainModule();
  });

  it('should create an instance', () => {
    expect(orderBlcokChainModule).toBeTruthy();
  });
});
