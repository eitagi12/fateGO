import { TestBed, inject } from '@angular/core/testing';

import { QrCodePageService } from './qr-code-page.service';

describe('QrCodePageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrCodePageService]
    });
  });

  it('should be created', inject([QrCodePageService], (service: QrCodePageService) => {
    expect(service).toBeTruthy();
  }));
});
