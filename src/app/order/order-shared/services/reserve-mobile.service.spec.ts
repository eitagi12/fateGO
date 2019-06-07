import { TestBed, inject } from '@angular/core/testing';

import { ReserveMobileService } from './reserve-mobile.service';
import { HttpClientModule } from '@angular/common/http';

describe('ReserveMobileService', () => {
  setupTestBed({
    imports: [HttpClientModule],
    providers: [ReserveMobileService]
  });

  it('should be created', inject([ReserveMobileService], (service: ReserveMobileService) => {
    expect(service).toBeTruthy();
  }));
});
