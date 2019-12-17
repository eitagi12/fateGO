import { NewRegisterMnpModule } from './new-register-mnp.module';

describe('NewRegisterMnpModule', () => {
  let newRegisterMnpModule: NewRegisterMnpModule;

  beforeEach(() => {
    newRegisterMnpModule = new NewRegisterMnpModule();
  });

  it('should create an instance', () => {
    expect(newRegisterMnpModule).toBeTruthy();
  });
});
