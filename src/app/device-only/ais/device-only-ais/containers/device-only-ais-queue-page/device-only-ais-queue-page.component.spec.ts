import { DeviceOnlyAisQueuePageComponent } from './device-only-ais-queue-page.component';
describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisQueuePageComponent;
  const homeService: any = {};
  const transactionService: any = {
    load: jest.fn()
  };
  const homeButtonService: any = {};
  const priceOptionService: any = {
    load: jest.fn()
  };
  beforeEach(() => {
    component = new DeviceOnlyAisQueuePageComponent(
      transactionService,
      priceOptionService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
