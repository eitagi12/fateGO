import { RomTransactionModule } from './rom-transaction.module';

describe('RomTransactionModule', () => {
  let romTransactionModule: RomTransactionModule;

  beforeEach(() => {
    romTransactionModule = new RomTransactionModule();
  });

  it('should create an instance', () => {
    expect(romTransactionModule).toBeTruthy();
  });
});
