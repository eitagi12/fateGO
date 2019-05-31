import { TestBed, inject } from '@angular/core/testing';

import { HomeButtonService } from './home-button.service';

describe('HomeButtonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeButtonService]
    });
  });

  it('should be created', inject([HomeButtonService], (service: HomeButtonService) => {
    expect(service).toBeTruthy();
  }));
});
