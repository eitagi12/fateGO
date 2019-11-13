import { TestBed, inject } from '@angular/core/testing';

import { QrCodeOmiseService } from './qr-code-omise.service';

describe('QrCodeOmiseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrCodeOmiseService]
    });
  });

  it('should be created', inject([QrCodeOmiseService], (service: QrCodeOmiseService) => {
    expect(service).toBeTruthy();
  }));
});
