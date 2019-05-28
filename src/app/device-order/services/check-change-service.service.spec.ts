import { TestBed, inject } from '@angular/core/testing';

import { CheckChangeServiceService } from './check-change-service.service';

describe('CheckChangeServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckChangeServiceService]
    });
  });

  it('should be created', inject([CheckChangeServiceService], (service: CheckChangeServiceService) => {
    expect(service).toBeTruthy();
  }));
});
