import { DeviceOnlyReadCardComponent } from './device-only-read-card.component';
import { BsModalService } from 'ngx-bootstrap';

describe('DeviceOnlyReadCardComponent', () => {
  let component: DeviceOnlyReadCardComponent;
  let bsModalService: any;

  beforeEach(() => {
    bsModalService = {};
    component = new DeviceOnlyReadCardComponent(bsModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
