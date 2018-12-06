import { OrderNewRegisterModule } from './order-new-register.module';

describe('OrderNewRegisterModule', () => {
  let orderNewRegisterModule: OrderNewRegisterModule;

  beforeEach(() => {
    orderNewRegisterModule = new OrderNewRegisterModule();
  });

  it('should create an instance', () => {
    expect(orderNewRegisterModule).toBeTruthy();
  });
});
