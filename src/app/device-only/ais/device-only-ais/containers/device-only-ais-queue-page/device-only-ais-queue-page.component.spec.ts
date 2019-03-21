import { DeviceOnlyAisQueuePageComponent } from './device-only-ais-queue-page.component';
describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisQueuePageComponent;
  const homeService: any = {};
  const transactionService: any = {
    load: jest.fn()
  };
  beforeEach(() => {
    component = new DeviceOnlyAisQueuePageComponent(
      homeService,
      transactionService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
