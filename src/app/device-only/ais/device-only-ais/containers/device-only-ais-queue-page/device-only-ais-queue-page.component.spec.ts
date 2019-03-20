import { DeviceOnlyAisQueuePageComponent } from './device-only-ais-queue-page.component';
describe('test device only ais queue page', () => {
  let component: DeviceOnlyAisQueuePageComponent;
  const homeService: any = {};
  beforeEach(() => {
    component = new DeviceOnlyAisQueuePageComponent(
      homeService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
