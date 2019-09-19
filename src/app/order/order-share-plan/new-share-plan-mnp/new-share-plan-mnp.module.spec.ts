import { NewSharePlanMnpModule } from './new-share-plan-mnp.module';

describe('NewSharePlanMnpModule', () => {
  let newSharePlanMnpModule: NewSharePlanMnpModule;

  beforeEach(() => {
    newSharePlanMnpModule = new NewSharePlanMnpModule();
  });

  it('should create an instance', () => {
    expect(newSharePlanMnpModule).toBeTruthy();
  });
});
