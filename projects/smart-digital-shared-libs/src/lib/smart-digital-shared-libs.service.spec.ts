import { TestBed, inject } from '@angular/core/testing';

import { SmartDigitalSharedLibsService } from './smart-digital-shared-libs.service';

describe('SmartDigitalSharedLibsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartDigitalSharedLibsService]
    });
  });

  it('should be created', inject([SmartDigitalSharedLibsService], (service: SmartDigitalSharedLibsService) => {
    expect(service).toBeTruthy();
  }));
});
