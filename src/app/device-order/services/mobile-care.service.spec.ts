import { TestBed, inject } from '@angular/core/testing';

import { MobileCareService } from './mobile-care.service';

describe('MobileCareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileCareService]
    });
  });

  it('should be created', inject([MobileCareService], (service: MobileCareService) => {
    expect(service).toBeTruthy();
  }));
});
