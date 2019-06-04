import { TestBed, inject } from '@angular/core/testing';

import { QueuePageService } from './queue-page.service';

describe('QueuePageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueuePageService]
    });
  });

  it('should be created', inject([QueuePageService], (service: QueuePageService) => {
    expect(service).toBeTruthy();
  }));
});
