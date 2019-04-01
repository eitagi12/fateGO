import { TestBed } from '@angular/core/testing';

import { QrcodePaymentService } from './qrcode-payment.service';

describe('QrcodePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QrcodePaymentService = TestBed.get(QrcodePaymentService);
    expect(service).toBeTruthy();
  });
});
