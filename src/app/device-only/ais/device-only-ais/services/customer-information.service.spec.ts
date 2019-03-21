import { TestBed, inject } from '@angular/core/testing';

import { CustomerInformationService } from './customer-information.service';

describe('CustomerInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerInformationService]
    });
  });

  it('should be created', inject([CustomerInformationService], (service: CustomerInformationService) => {
    expect(service).toBeTruthy();
  }));
});
