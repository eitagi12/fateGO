import { TestBed, inject } from '@angular/core/testing';

import { QRCodePaymentService } from './qrcode-payment.service';

describe('QRCodePaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QRCodePaymentService]
    });
  });

  it('should be created', inject([QRCodePaymentService], (service: QRCodePaymentService) => {
    expect(service).toBeTruthy();
  }));
});
