import { TestBed, inject } from '@angular/core/testing';

import { SummaryPageService } from './summary-page.service';

describe('SummaryPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SummaryPageService]
    });
  });

  it('should be created', inject([SummaryPageService], (service: SummaryPageService) => {
    expect(service).toBeTruthy();
  }));
});
