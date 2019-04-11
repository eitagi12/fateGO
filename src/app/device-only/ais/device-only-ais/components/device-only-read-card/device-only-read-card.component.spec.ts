import { DeviceOnlyReadCardComponent } from './device-only-read-card.component';
import { BsModalService } from 'ngx-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionAction, BillDeliveryAddress } from 'src/app/shared/models/transaction.model';
import { ReadCardService, ReadCardProfile, PageLoadingService, Utils, AlertService } from 'mychannel-shared-libs';
import { CustomerInformationService } from '../../services/customer-information.service';

describe('DeviceOnlyReadCardComponent', () => {
  let component: DeviceOnlyReadCardComponent;
  let bsModalService: any;
  let customerInfoService: any;
  const fb: any = {};
  const readCardService: any = {};
  const pageLoadingService: any = {};
  const utils: any = {};
  const alertService: any = {};
  beforeEach(() => {
    bsModalService = {};
    customerInfoService = {
      cancelreadcard: jest.fn()
    };
    component = new DeviceOnlyReadCardComponent(
      bsModalService,
      fb,
      readCardService,
      customerInfoService,
      pageLoadingService,
      utils,
      alertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
