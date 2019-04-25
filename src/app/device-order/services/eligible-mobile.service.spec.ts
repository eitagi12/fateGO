import { TestBed, inject } from '@angular/core/testing';

import { EligibleMobileService } from './eligible-mobile.service';

describe('EligibleMobileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligibleMobileService]
    });
  });

  it('should be created', inject([EligibleMobileService], (service: EligibleMobileService) => {
    expect(service).toBeTruthy();
  }));
});
