import { OrderMnpModule } from './order-mnp.module';

describe('OrderMnpModule', () => {
  let orderMnpModule: OrderMnpModule;

  beforeEach(() => {
    orderMnpModule = new OrderMnpModule();
  });

  it('should create an instance', () => {
    expect(orderMnpModule).toBeTruthy();
  });
});
