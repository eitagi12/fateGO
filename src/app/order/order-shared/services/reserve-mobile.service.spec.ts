import { TestBed, inject } from '@angular/core/testing';

import { ReserveMobileService } from './reserve-mobile.service';

describe('ReserveMobileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReserveMobileService]
    });
  });

  it('should be created', inject([ReserveMobileService], (service: ReserveMobileService) => {
    expect(service).toBeTruthy();
  }));
});
