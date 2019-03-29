import { TestBed, inject } from '@angular/core/testing';

import { QrcodePaymentService } from './qrcode-payment.service';

describe('QrcodePaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrcodePaymentService]
    });
  });

  it('should be created', inject([QrcodePaymentService], (service: QrcodePaymentService) => {
    expect(service).toBeTruthy();
  }));
});
