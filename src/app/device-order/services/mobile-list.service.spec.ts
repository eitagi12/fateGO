import { TestBed, inject } from '@angular/core/testing';

import { MobileListService } from './mobile-list.service';

describe('MobileListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileListService]
    });
  });

  it('should be created', inject([MobileListService], (service: MobileListService) => {
    expect(service).toBeTruthy();
  }));
});
