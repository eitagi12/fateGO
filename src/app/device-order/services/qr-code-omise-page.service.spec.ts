import { TestBed, inject } from '@angular/core/testing';

import { QrCodeOmisePageService } from './qr-code-omise-page.service';

describe('QrCodeOmisePageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrCodeOmisePageService]
    });
  });

  it('should be created', inject([QrCodeOmisePageService], (service: QrCodeOmisePageService) => {
    expect(service).toBeTruthy();
  }));
});
