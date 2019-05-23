import { DeviceOnlyAisResultQueuePageComponent } from './device-only-ais-result-queue-page.component';
describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisResultQueuePageComponent;
  const transactionService: any = {
    load: jest.fn()
  };
  const pageLoadingService: any = {
    closeLoading: jest.fn()
  };
  const priceOptionService: any = {
    load: jest.fn()
  };

  beforeEach(() => {
    component = new DeviceOnlyAisResultQueuePageComponent(
      transactionService,
      priceOptionService,
      pageLoadingService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
