import { TestBed, inject } from '@angular/core/testing';

import { ProfileFbbService } from './profile-fbb.service';

describe('ProfileFbbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileFbbService]
    });
  });

  it('should be created', inject([ProfileFbbService], (service: ProfileFbbService) => {
    expect(service).toBeTruthy();
  }));
});
