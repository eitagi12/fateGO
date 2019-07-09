import { TestBed, inject } from '@angular/core/testing';

import { MessageConfigService } from './message-config.service';

describe('MessageConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageConfigService]
    });
  });

  it('should be created', inject([MessageConfigService], (service: MessageConfigService) => {
    expect(service).toBeTruthy();
  }));
});
