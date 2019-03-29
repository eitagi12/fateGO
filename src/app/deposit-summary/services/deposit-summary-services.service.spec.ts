import { TestBed, inject } from '@angular/core/testing';

import { DepositSummaryServicesService } from './deposit-summary-services.service';

describe('DepositSummaryServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepositSummaryServicesService]
    });
  });

  it('should be created', inject([DepositSummaryServicesService], (service: DepositSummaryServicesService) => {
    expect(service).toBeTruthy();
  }));
});
