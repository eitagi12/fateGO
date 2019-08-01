import { VasPackageModule } from './vas-package.module';

describe('VasPackageModule', () => {
  let vasPackageModule: VasPackageModule;

  beforeEach(() => {
    vasPackageModule = new VasPackageModule();
  });

  it('should create an instance', () => {
    expect(vasPackageModule).toBeTruthy();
  });
});
